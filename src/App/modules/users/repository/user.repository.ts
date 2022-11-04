import { CustomRepository, BaseFirestoreRepository } from 'fireorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/read-user.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Bucket } from '@google-cloud/storage';
import { File } from '../../../../Utility/utility-createFile';
import { userResponse } from '../constants/user.restrictions';
import { Logger } from '@nestjs/common';

export interface IUserRepository {
  createOne(payload: CreateUserDto): Promise<number>;
  getAllAsync(): Promise<UserDto[]>;
  getUserbyId(uid: string): Promise<UserDto>;
  getUsersByUids(uids: string[]): Promise<User[]>;
  updateUser(
    file: Express.Multer.File,
    bucket: Bucket,
    payload: UpdateUserDto,
  ): Promise<string>; // ===> esto debe ser mediante un trigger
  ifExist(nickName: string): Promise<number>;
}

@CustomRepository(User)
export class UsersRepository
  extends BaseFirestoreRepository<User>
  implements IUserRepository
{
  constructor(private readonly logger: Logger) {
    super(User);
  }
  public getUsersByUids = async (uids: string[]): Promise<User[]> => {
    const users = await this.find();
    const selectedUsers = new Array<User>();
    uids.forEach((uid: any) => {
      const currentIndex = users.findIndex((x) => x.uid === uid);
      selectedUsers.push(users[currentIndex]);
    });
    return selectedUsers;
  };
  /**
   * @ReadOperations => Segmento de Operaciones de  Lectura
   */
  public getUserbyId = async (uid: string): Promise<UserDto> =>
    plainToClass(UserDto, await this.whereEqualTo((u) => u.uid, uid).findOne());

  public getAllAsync = async (): Promise<UserDto[]> =>
    (await this.find()).map((user: User) => plainToClass(UserDto, user));

  public ifExist = async (nickName: string): Promise<userResponse> => {
    const user = await this.whereEqualTo(
      (u) => u.nickName,
      nickName.trim(),
    ).findOne();
    return user == null ? userResponse.notExist : userResponse.userExist;
  };

  /**
   * @WriteOperations => Segmento de Operaciones de Escritura(Mutablidad)
   */
  public async updateUser(
    file: Express.Multer.File = undefined,
    bucket: Bucket = undefined,
    payload: UpdateUserDto,
  ): Promise<string> {
    try {
      if (!file || file === undefined || file === null) {
        await this.helperPatch(payload);
        return Promise.resolve(
          'No hay imagen para actualizar! se actualizan los demás campos',
        );
      } else {
        payload.profilePic = await File.submitFile(file, bucket);
        await this.helperPatch(payload, bucket);
        return Promise.resolve(payload.profilePic);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  public async helperPatch(payload: UpdateUserDto, bucket: Bucket = null) {
    const foundUser = plainToClass(User, await this.getUserbyId(payload.uid));
    if (bucket != null) await File.removeFile(foundUser.profilePic, bucket);
    foundUser.firstName = payload.firstName ?? foundUser.firstName;
    foundUser.lastName = payload.lastName ?? foundUser.lastName;
    foundUser.email = payload.email ?? foundUser.email;
    foundUser.profilePic = payload.profilePic ?? foundUser.profilePic;
    foundUser.token = payload.token ?? foundUser.token;
    foundUser.onlineStatus = payload.onlineStatus ?? foundUser.onlineStatus;
    if (payload.group != null) foundUser.groups.push(payload.group);
    await this.update(foundUser);
  }

  public async createOne(payload: CreateUserDto): Promise<userResponse> {
    try {
      this.logger.log('Validating if user Exist', UsersRepository.name);
      const flag = await this.ifExist(payload.nickName);
      this.logger.log('Validating Process ended', UsersRepository.name);
      if (flag == userResponse.userExist) {
        this.logger.warn(
          'The Nickname Already Exists... Proceed to kill the process',
          UsersRepository.name,
        );
        return userResponse.userExist;
      }
      await this.runTransaction(async (tran) => {
        const model = plainToClass(User, payload);
        const newUser = await tran.create(model);
        return newUser;
      });
      this.logger.log('The user Was Created, Process Ended Succesfully...');
      return userResponse.userCreated;
    } catch (error) {
      this.logger.error(error, UsersRepository.name);
    }
  }
}

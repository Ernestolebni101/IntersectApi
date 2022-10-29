import { CustomRepository, BaseFirestoreRepository } from 'fireorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/read-user.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Bucket } from '@google-cloud/storage';
import { File } from '../../../../Utility/utility-createFile';

export interface IUserRepository {
  createOne(payload: CreateUserDto): Promise<number>;
  getAllAsync(): Promise<UserDto[]>;
  getUserbyId(uid: string): Promise<UserDto>;
  getUsersByUids(uids: string[]): Promise<User[]>;
  updateUser(
    file: any,
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

  public ifExist = async (nickName: string): Promise<number> => {
    const user = await this.whereEqualTo(
      (u) => u.nickName,
      nickName.trim(),
    ).findOne();
    const number: number = user != null ? 404 : 201;
    return number;
  };

  /**
   * @WriteOperations => Segmento de Operaciones de Escritura(Mutablidad)
   */
  public async updateUser(
    file: any = undefined,
    bucket: Bucket = undefined,
    payload: UpdateUserDto,
  ): Promise<string> {
    try {
      if (!file || file === undefined || file === null) {
        await this.helperPatch(payload);
        return Promise.resolve(
          'No hay imagen para actualizar! se actualizan los demás componentes',
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

  public async createOne(payload: CreateUserDto): Promise<number> {
    let flag = await this.ifExist(payload.nickName);
    if (flag != 400) {
      flag = await this.runTransaction(async (tran) => {
        const model = plainToClass(User, payload);
        await tran.create(model);
        return flag;
      });
      return flag;
    } else return flag;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/read-user.dto';
import { UnitOfWorkAdapter } from '../../Database/UnitOfWork/adapter.implements';
import { IUserRepository } from './repository/user.repository';
import { Bucket } from '@google-cloud/storage';
import { IGroupsRepository } from '../groups/repository/groups.repository';
import { userResponse } from './constants/user.restrictions';

@Injectable()
export class UsersService {
  private readonly userRepository: IUserRepository;
  private readonly groupRepository: IGroupsRepository;
  private readonly bucket: Promise<Bucket>;
  constructor(private readonly _adapter: UnitOfWorkAdapter) {
    this.userRepository = this._adapter.Repositories.userRepository;
    this.groupRepository = this._adapter.Repositories.groupsRepository;
    this.bucket = this._adapter.getBucket();
  }

  public findAllAsync? = async (): Promise<Array<UserDto>> =>
    await this.userRepository.getAllAsync();

  public async findOne?(id: string): Promise<UserDto> {
    return await this.userRepository.getUserbyId(id);
  }

  /**
   * @WriteOperations => Segmento de Operaciones de Escritura(Mutablidad)
   */

  /**
   * *Registra un Nuevo Usuario en la Base de Datos
   */
  public create = async (payload: CreateUserDto): Promise<userResponse> =>
    await this.userRepository.createOne(payload);

  /**
   *
   * @param file hace referencia a la foto de perfil
   * @param updateUserDto modelo para actualizar los datos del usuario
   * @returns
   */
  public async update?(
    file: Express.Multer.File,
    updateUserDto: UpdateUserDto,
  ): Promise<string> {
    return await this.userRepository.updateUser(
      file,
      await this.bucket,
      updateUserDto,
    );
  }

  public remove(id: number) {
    return `This action removes a #${id} user`;
  }

  public getOwnGroups = async (uid: string) =>
    await this.groupRepository.getGroupAsyncByParams(uid, '');
}

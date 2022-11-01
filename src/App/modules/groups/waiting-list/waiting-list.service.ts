import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { UnitOfWorkAdapter } from 'src/App/Database/UnitOfWork/adapter.implements';
import { UserPartialDto } from 'src/App/modules/users/dto/read-user.dto';
import { IUserRepository } from 'src/App/modules/users/repository/user.repository';
import { CreateWaitingListDto } from './dto/create-waiting-list.dto';
import { WaitingListDto } from './dto/read-group-dto';
import { UpdateWaitingListDto } from './dto/update-waiting-list.dto';
import { WaitingList } from './entities/waiting-list.entity';
import { IWaitListRepository } from './repository/waiting-list-repository';

@Injectable()
export class WaitingListService {
  private readonly waitListRepository: IWaitListRepository;
  private readonly userRepository: IUserRepository;

  constructor(
    private readonly adapter: UnitOfWorkAdapter,
    private readonly eventEvemmiter: EventEmitter2,
  ) {
    this.waitListRepository = adapter.Repositories.waitListRepository;
    this.userRepository = adapter.Repositories.userRepository;
  }
  public create = async (createWaitingListDto: CreateWaitingListDto) =>
    await this.waitListRepository.insertList(createWaitingListDto);

  public fetchAllAsync = async () =>
    await this.waitListRepository.fetchAllAsync();

  /**
   * Este metodo devuelve las solicitudes  baneadas relacionados a un grupo de manera asincrona
   * @modifiedDate => 04/14/2022
   * @news => Actualmente el algoritmo esta optimizado al máximo con las caracteristicas del lenguaje
   * @param groupId Identificador unico del Grupo para realizar y concatenar las
   * solicitudes relacionadas al mismo grupo
   * @returns
   */
  public fetchBannedUsers = async (
    groupId: string,
  ): Promise<Array<WaitingListDto>> => {
    const modelCollection = await this.waitListRepository.fetchBannedUsers(
      groupId,
    );
    const mappedElements = await Promise.all(
      modelCollection
        .map(async (w: WaitingList) => ({
          ...w,
          user: UserPartialDto.Factory(
            await this.userRepository.getUserbyId(w.userId),
          ),
        }))
        .map((x) => plainToInstance(WaitingListDto, x)),
    );
    return mappedElements;
  };

  /**
   * Este metodo devuelve las solicitudes para unirse a un grupo de manera asincrona
   * @modifiedDate => 04/14/2022
   * @news => Actualmente el algoritmo esta optimizado al máximo con las caracteristicas del lenguaje
   * @param groupId Identificador unico del Grupo para realizar y concatenar las
   * solicitudes relacionadas al mismo grupo
   * @returns
   */
  public fetchRequestsAsync = async (
    groupId: string,
  ): Promise<Array<WaitingListDto>> => {
    try {
      const modelCollection = await this.waitListRepository.fetchRequestsAsync(
        groupId,
      );
      const mappedElements = await Promise.all(
        modelCollection
          .map(async (w: WaitingList) => ({
            ...w,
            user: UserPartialDto.Factory(
              await this.userRepository.getUserbyId(w.userId),
            ),
          }))
          .map((x) => plainToInstance(WaitingListDto, x)),
      );
      return mappedElements;
    } catch (e) {
      console.error(`error encontradod ${e}`);
      throw new Error(e);
    }
  };
  /**
   *  Este metodo permite manerjar los estados de las solicitudes del grupo
   * @param payload Carga util para actualizar los campos de la solicitud(aceptar, eliminar ,banear)
   * @returns No retorna ningun valor
   */
  public updateAsync = async (payload: UpdateWaitingListDto): Promise<void> =>
    await this.waitListRepository.updateList(payload, this.eventEvemmiter);
}

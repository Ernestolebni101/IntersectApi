import { BaseFirestoreRepository, CustomRepository } from 'fireorm';
import { plainToInstance } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WaitingList } from '../entities/waiting-list.entity';
import { CreateWaitingListDto } from '../dto/create-waiting-list.dto';
import { UpdateWaitingListDto } from '../dto/update-waiting-list.dto';

export interface IWaitListRepository {
  insertList(payload: CreateWaitingListDto): Promise<WaitingList>;
  updateList(
    payload: UpdateWaitingListDto,
    eventEmitter: EventEmitter2,
  ): Promise<void>;
  fetchAllAsync(): Promise<Array<WaitingList>>;
  fetchRequestsAsync(groupId: string): Promise<Array<WaitingList>>;
  fetchBannedUsers?(groupId: string): Promise<Array<WaitingList>>;
  fetchAllByGroups(groupId: string): Promise<Array<WaitingList>>;
}

@CustomRepository(WaitingList)
export class WaitListRepository
  extends BaseFirestoreRepository<WaitingList>
  implements IWaitListRepository
{
  public fetchAllByGroups = async (groupId: string): Promise<WaitingList[]> =>
    await this.whereEqualTo((w) => w.groupId, groupId).find();

  public async fetchAllAsync(): Promise<WaitingList[]> {
    throw new Error('Method not implemented.');
  }
  /**
   * @Author Ernesto Miranda
   * @CreatedDate 2/24/2022
   * @ModifiedDate 2/25/2022
   * @param payload  Carga util para ejecutar el metodo
   * @Description Realiza el proceso de busqueda por grupo
   */
  public async fetchRequestsAsync(
    groupId: string,
  ): Promise<Array<WaitingList>> {
    try {
      const model = await this.whereEqualTo((w) => w.groupId, groupId).find();
      return model.filter(
        (x) => !(x.isBanned === true && x.groupId === groupId),
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  /**
   * *
   * @param groupId identificador de Grupo
   * @returns  Listas de Espera
   */
  public fetchBannedUsers? = async (
    groupId: string,
  ): Promise<Array<WaitingList>> => {
    try {
      const qBuilder = this.whereEqualTo((w) => w.groupId, groupId);
      const foundElements = await qBuilder.find();
      return foundElements.filter(
        (x) => x.isBanned === true && x.groupId === groupId,
      );
    } catch (error) {
      throw new Error(error);
    }
  };
  /**
   * @Author Ernesto Miranda
   * @CreatedDate 2/24/2022
   * @ModifiedDate 2/25/2022
   * @param payload  Carga util para ejecutar el metodo
   * @Description Realiza el proceso de Inserción
   */
  public async insertList(payload: CreateWaitingListDto): Promise<WaitingList> {
    try {
      const model = plainToInstance(WaitingList, payload);
      const foundList = await this.whereEqualTo(
        (w) => w.groupId,
        model.groupId,
      ).find();
      let inserted = foundList.find((z) => z.userId === payload.userId);
      if (!inserted) {
        inserted = await this.create(model);
      }
      return inserted;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * @Author Ernesto Miranda
   * @ModifiedDate 2/24/2022
   * @param payload  Carga util para ejecuta el metodo
   * @param eventEmitter Desencadenador de evento
   */
  public async updateList(
    payload: UpdateWaitingListDto,
    eventEmitter: EventEmitter2,
  ): Promise<void> {
    try {
      const model = await this.findById(payload.id);
      model.isBanned = payload.isBanned ?? model.isBanned;
      model.isAccepted = payload.isAccepted ?? model.isAccepted;
      model.isNotified = payload.isNotified ?? model.isNotified;
      await this.update(model);
      if (payload.isBanned && payload.isNotified)
        await eventEmitter.emitAsync('onDeniedOrBanned', payload);
      switch (payload.isAccepted) {
        case true:
          await this.delete(payload.id);
          await eventEmitter.emitAsync('onAcceptedRequest', payload); // => Acceder al servicio de grupos para actualizar miembros nuevos
          break;
        case false:
          await this.delete(payload.id);
          await eventEmitter.emitAsync('onDeniedOrBanned', payload); // Cuando se deniega la solicitud
          break;
        default:
          console.log('No se tomo ninguna opcion en el switch case');
          break;
      }
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }
}

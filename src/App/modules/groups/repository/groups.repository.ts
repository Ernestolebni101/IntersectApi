import { CreateGroupDto, GroupSettings } from '../dto/create-group.dto';
import { GroupDto } from '../dto/read-group.dto';
import { BaseFirestoreRepository, CustomRepository } from 'fireorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Group } from '../entities/group.entity';
import { Bucket } from '@google-cloud/storage';
import { MemberOpt, UpdateGroupDto } from '../dto/update-group.dto';
import { File } from '../../../../Utility/utility-createFile';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const FIRSTGROUP = 'IGROUPSERVICE';

export interface IGroupsRepository {
  ifExist(groupName: string): Promise<number>;
  getAllAsync(filter: string): Promise<Array<Group>>;
  getGroupByParams(searchParam: string): Promise<GroupDto>;
  getById(groupId: string): Promise<Group>;
  getIntersectedGroups(userId: string): Promise<Array<GroupDto>>;
  getGroupAsyncByParams(
    searchParam: string,
    opt: string,
  ): Promise<Array<GroupDto>>;
  updateGroup(
    file: Express.Multer.File,
    payload: UpdateGroupDto,
    bucket: Bucket,
    eventEmitter: EventEmitter2,
  ): Promise<string>;
  createGroup(payload: CreateGroupDto): Promise<Group>;
}

@CustomRepository(Group)
export class GroupsRepository
  extends BaseFirestoreRepository<Group>
  implements IGroupsRepository
{
  /**
   *
   *  *+++++++++++++++++++++++++++++++ @ReadOperations => Segmento de Operaciones de Lectura
   */
  /**
   *        *        ====================  @Documentation ====================
   * @function ifEXist Realiza flujos condicionales antes de crear un Grupo nuevo
   * @param groupName Nombre del Grupo
   * @returns retorna un numero entero 204 o 201
   */
  public ifExist = async (groupName: string): Promise<number> => {
    const foundGroup = await this.getGroupByParams(groupName);
    if (foundGroup) return Promise.resolve(204);
    else return Promise.resolve(201);
  };
  /**
   *  *       ====================  @Documentation ====================
   * @description => Devuelve los grupos en los que el usuario está intersectado
   */
  public getIntersectedGroups = async (userId: string): Promise<GroupDto[]> => {
    const groups = await this.whereArrayContains((g) => g.users, userId).find();
    return groups
      .map((g: Group) => plainToInstance(GroupDto, g))
      .sort((a, b) => a.flag - b.flag)
      .reverse();
  };
  /**
   *      *     ====================  @Documentation ====================
   * @description => Devuelve el grupo con el nombre que se pasa por parámetro
   */
  public async getGroupByParams(searchParam: string): Promise<GroupDto> {
    return plainToInstance(
      GroupDto,
      await this.whereEqualTo((g) => g.groupName, searchParam).findOne(),
    );
  }
  /**s
   *  *  ====================  @Documentation ====================
   *@description => Devuelve los usuarios intersectados en el grupo*/
  public getById = async (groupId: string): Promise<Group> =>
    await this.findById(groupId);
  /**
   *            ====================  @Documentation ====================
   * @returns  => Devuelve todos los grupos contenidos en la base de Datos
   *  @description debería llevar un metodo de paginación para evitar que el sistema colapse en un petición
   */
  public getAllAsync = async (filter: string): Promise<Array<Group>> => {
    const ctx = [false, true];
    let collection: Group[];
    if (Number.isNaN(Number(filter))) {
      collection = await this.whereEqualTo(
        (g) => g.groupName,
        filter.toLowerCase(),
      ).find();
      return collection.sort((a, b) => a.flag - b.flag).reverse() ?? null;
    }
    collection = await this.whereEqualTo(
      (g) => g.isCertified,
      ctx[parseInt(filter)],
    ).find();
    return collection.sort((a, b) => a.flag - b.flag).reverse() ?? null;
  };

  public getGroupAsyncByParams = async (
    searchParam: string,
    opt = 'N',
  ): Promise<GroupDto[]> => {
    return (await this.whereEqualTo((g) => g.author, searchParam).find()).map(
      (g) => plainToInstance(GroupDto, g),
    );
  };
  /**
   *
   * * ******************************@WriteOperations => Segmento de Operaciones de Escritura
   */
  /**
   * created Date: 12/08/2022  **********
   * modified Date: 12/08/2022
   * ! Se debe configurar el groupSettings cuando el usuario no exista en el grupo, de lo contrario, habrá App Crashing
   * *descripcion:  este metodo se encarga de crear un grupo, solo mantiene esta responsabilidad
   * @param payload carga util con informacion del grupo
   */
  public async createGroup(payload: CreateGroupDto): Promise<Group> {
    const transResult = await this.runTransaction(async (executeTran) => {
      const groupData = plainToInstance(Group, payload);
      groupData.groupSettings.push(
        instanceToPlain(new GroupSettings(payload.createdBy, true)),
      );
      groupData.users.push(payload.createdBy);
      const tranResult = await executeTran.create(groupData);
      return tranResult;
    });
    if (transResult == undefined || transResult == null) {
      throw new Error('No se completo la creacion de grupo');
    }
    return transResult;
  }
  //TODO: Reestructurar el metodo de Actualización. El dto tiene campos que no siempre se utilizan
  /**
   * @Author : Ernesto Miranda
   * @ModifiedDate :   2/17/2022
   * @description  : Metodo encargado de actualizar los elementos de un grupo Ocupa el helper Patch para disminuir el volumen de código y hacer frente
   * a dos escenarios, cuando se actualiza la foto de perfil y cuando no hay actualización de la misma
   */
  public updateGroup = async (
    file: Express.Multer.File = undefined,
    payload: UpdateGroupDto,
    bucket: Bucket,
    eventEmitter: EventEmitter2,
  ): Promise<string> => {
    try {
      if (!file || file === undefined || file === null) {
        await this.helperPatch(payload, null, eventEmitter);
        return Promise.resolve(
          'No hay imagen para actualizar! se actualizan los demás componentes',
        );
      } else {
        payload.groupProfile = await File.submitFile(file, bucket);
        await this.helperPatch(payload, bucket, eventEmitter);
        return payload.groupProfile;
      }
    } catch (e) {
      console.error(`Error encontrado: ${e}`);
      // throw new Error(e);
    }
  };
  /**
   * @Author : Ernesto Miranda
   * @ModifiedDate :   2/17/2022
   * @description  : Método auxiliar para realizar una actualización en la entidad Grupo
   */
  private async helperPatch(
    payload: UpdateGroupDto,
    bucket: Bucket = null,
    eventEmitter: EventEmitter2,
  ) {
    let foundGroup = await this.findById(payload.id);
    if (bucket != null) await File.removeFile(foundGroup.groupProfile, bucket);
    if (payload.memberOption !== MemberOpt.none) {
      foundGroup = await this.memberOperation(
        payload,
        foundGroup,
        eventEmitter,
      );
    }
    if (payload.flag && payload.modifiedDate) {
      foundGroup.flag = payload.flag;
      foundGroup.modifiedDate = payload.modifiedDate;
    }
    foundGroup.groupProfile = payload.groupProfile ?? foundGroup.groupProfile;
    foundGroup.isActive = payload.isActive ?? foundGroup.isActive;
    foundGroup.isPrivate = payload.isPrivate ?? foundGroup.isPrivate;
    foundGroup.lastMessage = payload.lastMessage ?? foundGroup.lastMessage;
    foundGroup.whosWriting = payload.whosWriting ?? '';
    foundGroup.isCertified = payload.isCertified ?? foundGroup.isCertified;
    foundGroup.isWriting = payload.isWriting ?? false;
    await this.update(foundGroup);
    if (payload.isActive) {
      await eventEmitter.emitAsync('onOpenGroup', foundGroup.id);
    }
    if (foundGroup.users.length === 0) {
      await this.runTransaction(async (tran) => {
        await tran.delete(foundGroup.id);
      });
    }
  }
  /**
   * @param payload Parametros de actualizacion para grupo
   * @param foundGroup Grupo Encontrado que será actualizado
   * @param eventEmitter Emisor de Eventos
   * @returns Grupo Modificado
   */
  public async memberOperation(
    payload: UpdateGroupDto,
    foundGroup: Group,
    eventEmitter: EventEmitter2,
  ): Promise<Group> {
    switch (payload.memberOption) {
      case MemberOpt.addMember:
        if (!foundGroup.users.includes(payload.userId)) {
          foundGroup.users.push(payload.userId);
          await eventEmitter.emitAsync(
            'onAccess',
            payload.userId,
            foundGroup.id,
          );
        }
        return foundGroup;
      case MemberOpt.removeMember:
        foundGroup.users = foundGroup.users.filter(
          (x) => !(x === payload.userId),
        );
        if (
          payload.userId === foundGroup.author &&
          foundGroup.users.length !== 0
        ) {
          foundGroup.author =
            foundGroup.inheritOwner !== ''
              ? foundGroup.inheritOwner
              : foundGroup.users[0];
          await eventEmitter
            .emitAsync('onChangedOwner', foundGroup.author, foundGroup.id)
            .catch((e) => console.error(e)); // => Salida de un Owner
        } else payload.userId !== foundGroup.author;
        await eventEmitter.emitAsync(
          'onExit',
          foundGroup.author,
          payload.userId,
          foundGroup.id,
        ); // => Salida de un usuario
        return foundGroup;
      case MemberOpt.setOwner:
        foundGroup.inheritOwner = payload.userId;
        return foundGroup;
      case MemberOpt.setNotificationSettings:
        foundGroup.groupSettings.map((s) => {
          if (s.userId === payload.userId) {
            s.isNotify = payload.isNotify;
            return s;
          }
        });
        return foundGroup;
    }
  }
}

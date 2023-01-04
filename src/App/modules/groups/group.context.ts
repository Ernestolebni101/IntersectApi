import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { firebaseClient } from '../../Database/database-providers/firebase.provider';
import { FIREBASE_APP_CLIENT, GPATH } from '../../Database/database.constants';
import { UnitOfWorkAdapter } from '../../Database/UnitOfWork/adapter.implements';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './entities/group.entity';
import { AddingStrategy } from './providers/providers.strategys/adding.strategy';
import { RequestingStrategy } from './providers/providers.strategys/requesting.strategy';
import { IGroupsRepository } from './repository/groups.repository';

@Injectable()
export class GroupContext {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly groupRepo: IGroupsRepository;
  constructor(
    @Inject(FIREBASE_APP_CLIENT)
    private readonly managerServices: firebaseClient,
    private readonly requestingStrategy: RequestingStrategy,
    private readonly addingStrategy: AddingStrategy,
    private readonly adapter: UnitOfWorkAdapter,
  ) {
    this.db = this.managerServices.firestore();
    this.groupRepo = this.adapter.Repositories.groupsRepository;
  }
  /**
   * Este metodo es desencadenado cuando se escribe en la main(crear grupos), desencadena varios
   * comportamientos
   * @param payload :Parametros para crear un m  grupo
   * * La redirección funciona bien
   * * La adición funciona bien
   * * La solicitud funciona bien
   * TODO verificar los datos que recibirá el frontend por cada operación
   * TODO empaquetar la carga util de la http request en un solo body para evitar parametros innecesarios
   */
  public executeFirstStrategy = async (
    payload: CreateGroupDto,
  ): Promise<object> => {
    try {
      const record = {};
      const collection = this.db.collection(GPATH);
      const foundDoc =
        (await collection.where('groupName', '==', payload.groupName).get())
          .docs[0] ?? null;
      const opt = this.helperFunction(foundDoc, payload.createdBy);
      switch (opt) {
        case groupEnum.add:
          await this.addingStrategy.Execute(
            payload,
            plainToInstance(Group, foundDoc.data()),
          );
          record['groupData'] = plainToInstance(Group, foundDoc.data());
          record['operationType'] = groupEnum.add;
          break;
        case groupEnum.createNew:
          const inserted = await this.groupRepo.createGroup(payload);
          record['groupData'] = inserted;
          record['operationType'] = groupEnum.createNew;
          break;
        case groupEnum.request: //* Verificado
          await this.requestingStrategy.Execute(
            payload,
            plainToInstance(Group, foundDoc.data()),
          );
          record['groupData'] = 'is private o certified';
          record['operationType'] = foundDoc.data()['isCertified']
            ? groupEnum.premium
            : groupEnum.request;
          break;
        case groupEnum.redirect:
          record['groupData'] = foundDoc.data();
          record['operationType'] = groupEnum.redirect;
          break;
      }
      return record;
    } catch (error) {
      console.error(error);
    }
  };

  private helperFunction = (
    foundGroup: FirebaseFirestore.DocumentData,
    userId: string,
  ): number => {
    // si la consulta viene vacía
    if (foundGroup == null || foundGroup == undefined)
      return groupEnum.createNew;
    // si el usuario se encuentra en el grupo
    if (plainToInstance(Group, foundGroup.data()).users.includes(userId))
      return groupEnum.redirect;
    if (foundGroup.data().isPrivate) return groupEnum.request;
    // si es privado, se solicita
    else return groupEnum.add; // si no es privado añadir
  };
}

export enum groupEnum {
  redirect = 0, // el usuario se encuentra en el grupo
  add = 1, // el usuario no está en el grupo pero es publico
  request = 2, // el grupo es privado,
  createNew = 3, // El grupo no existe
  premium = 4,
}

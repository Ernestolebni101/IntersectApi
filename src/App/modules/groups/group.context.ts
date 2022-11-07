import { Inject, Injectable, Scope } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { firebaseClient } from '../../Database/database-providers/firebase.provider';
import { FIREBASE_APP_CLIENT, GPATH } from '../../Database/database.constants';
import { UnitOfWorkAdapter } from '../../Database/UnitOfWork/adapter.implements';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './entities/group.entity';
import {
  AddingStrategy,
  IaddingToken,
} from './providers/providers.strategys/adding.strategy';
import {
  IREQUEST,
  RequestingStrategy,
} from './providers/providers.strategys/requesting.strategy';
import { IGroupsRepository } from './repository/groups.repository';

@Injectable({ scope: Scope.TRANSIENT })
export class GroupContext {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly groupRepo: IGroupsRepository;
  constructor(
    @Inject(FIREBASE_APP_CLIENT)
    private readonly managerServices: firebaseClient,
    @Inject(IREQUEST)
    private readonly requestingStrategy: RequestingStrategy,
    @Inject(IaddingToken)
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
  ): Promise<any> => {
    try {
      const collection = this.db.collection(GPATH);
      const foundDoc =
        (await collection.where('groupName', '==', payload.groupName).get())
          .docs[0] ?? null;
      const opt = this.helperFunction(foundDoc, payload.createdBy);
      switch (opt) {
        case groupEnum.add:
          this.addingStrategy.Execute(
            payload,
            plainToInstance(Group, foundDoc.data()),
          );
          return {
            groupData: foundDoc.data(),
            operationType: groupEnum.add,
          };
        case groupEnum.createNew:
          const inserted = await this.groupRepo.createGroup(payload);
          return instanceToPlain({
            groupData: inserted,
            operationType: groupEnum.createNew,
          });
        case groupEnum.request:
          await this.requestingStrategy.Execute(
            payload,
            plainToInstance(Group, foundDoc.data()),
          );
          return {
            groupData: plainToInstance(Group, foundDoc.data()),
            operationType: groupEnum.request,
          };
        case groupEnum.redirect:
          return {
            groupData: foundDoc.data(),
            operationType: groupEnum.redirect,
          };
      }
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
}

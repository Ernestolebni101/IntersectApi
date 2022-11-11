import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { instanceToPlain } from 'class-transformer';
import { firebaseClient } from '../../../../Database/database-providers/firebase.provider';
import {
  FIREBASE_APP_CLIENT,
  GPATH,
} from '../../../../Database/database.constants';
import {
  IGroupEntity,
  IGroupStrategy,
} from '../../../../shared/strategys/istrategy.interface';
import { Group } from '../.././entities/group.entity';

export const IaddingToken = Symbol('AddingStrategy');
Injectable();
export class AddingStrategy implements IGroupStrategy {
  private readonly db: FirebaseFirestore.Firestore;
  constructor(
    @Inject(FIREBASE_APP_CLIENT)
    private readonly managerServices: firebaseClient,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.db = this.managerServices.firestore();
  }
  public async Execute<TModel extends IGroupEntity>(
    model: TModel,
    foundGroup: Group,
  ): Promise<any> {
    const { createdBy } = instanceToPlain(model);
    const collection = this.db.collection(GPATH);
    foundGroup.users.push(createdBy);
    collection.doc(foundGroup.id).update(instanceToPlain(foundGroup));
    return Promise.resolve(
      await this.eventEmitter.emitAsync(
        'onAddMember',
        createdBy,
        foundGroup.id,
      ),
    );
  }
}

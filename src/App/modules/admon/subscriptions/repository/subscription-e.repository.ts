import { Inject, Injectable } from '@nestjs/common';
import {
  IAbstractRepository,
  IParam,
} from 'src/App/shared/utils/query.interface';
import {
  firestoreDb,
  FirestoreCollection,
  FIRESTORE_DB,
} from '../../../../Database/index';
import { Subscription } from '../dtos/read-subscriptions.dto';

@Injectable()
export class SubscriptionRepository
  implements IAbstractRepository<Subscription>
{
  private readonly collection: FirestoreCollection;
  constructor(@Inject(FIRESTORE_DB) private readonly fireDb: firestoreDb) {
    this.collection = this.fireDb.collection('Suscriptions');
  }
  public async getByParam<TParam extends IParam>(
    payload: TParam,
  ): Promise<Subscription[]> {
    throw new Error('Method not implemented.');
  }
  public async getById<TParam extends IParam>(
    payload: TParam,
  ): Promise<Subscription> {
    throw new Error('Method not implemented.');
  }
  public async getAll<TParam extends IParam>(
    payload: TParam,
  ): Promise<Subscription[]> {
    throw new Error('Method not implemented.');
  }
  public async modifyData<TParam extends IParam>(
    payload: TParam,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async createNew<TParam extends IParam>(
    payload: TParam,
  ): Promise<Subscription> {
    throw new Error('Method not implemented.');
  }
}

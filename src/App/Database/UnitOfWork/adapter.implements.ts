import { IUnitOfWorkAdapter } from '../IUnitOfWork/interfaces.unitofWork';
import { Injectable, Inject, Scope } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { UnitOfWorkRepository } from './repositories.implements';
import { FIRESTORE_DB } from '../database.constants';
import { firestoreDb } from '../database-providers/firebase.provider';
import { Bucket } from '@google-cloud/storage';
import { GroupsRepository } from 'src/App/modules/groups/repository/groups.repository';
import { UsersRepository } from 'src/App/modules/users';
import { MessageRepository } from 'src/App/modules/messages/repository/message.repository';
import { WaitListRepository } from 'src/App/modules/groups/waiting-list/repository/waiting-list-repository';
import { ChatRepository } from 'src/App/modules/chats/repository/chat-repository';
import * as fireorm from 'fireorm';
import { SubscriptionDetailRepository } from 'src/App/modules/admon/subscriptions/repository/subscription-detail.repository';
import { BillingPeriodRepository } from 'src/App/modules/admon/catalogs/billing-period/repository/period.repository';
import { SubRepository } from 'src/App/modules/admon/subscriptions/repository/subrepository';
import { Generic } from 'src/App/modules/admon/subscriptions/repository/gener';

@Injectable({ scope: Scope.DEFAULT })
export class UnitOfWorkAdapter implements IUnitOfWorkAdapter {
  public _transaction: firebase.firestore.WriteBatch;
  public readonly Repositories: UnitOfWorkRepository;
  constructor(@Inject(FIRESTORE_DB) private readonly db: firestoreDb) {
    this._transaction = this.db.batch();
    fireorm.initialize(db);
    this.Repositories = new UnitOfWorkRepository(
      new UsersRepository(),
      new GroupsRepository(),
      new MessageRepository(),
      new WaitListRepository(),
      new ChatRepository(),
      new SubscriptionDetailRepository(db),
      new BillingPeriodRepository(db),
      new SubRepository(db),
      new Generic(db),
    );
  }
  public commitChanges = async (): Promise<void> => {
    await this._transaction.commit();
  };

  public getBucket = async (): Promise<Bucket> =>
    Promise.resolve(firebase.storage().bucket());
}

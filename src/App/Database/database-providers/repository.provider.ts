import { Provider, Scope } from '@nestjs/common';
import { ChatRepository } from 'src/App/modules/chats/repository/chat-repository';
import { GroupsRepository } from 'src/App/modules/groups/repository/groups.repository';
import { WaitListRepository } from 'src/App/modules/groups/waiting-list/repository/waiting-list-repository';
import { MessageRepository } from 'src/App/modules/messages/repository/message.repository';
import { UsersRepository } from 'src/App/modules/users';
import { FIRESTORE_DB } from '../database.constants';
import * as fireorm from 'fireorm';
import { firestoreDb } from './firebase.provider';
import { SubscriptionDetailRepository } from 'src/App/modules/admon/subscriptions/repository/subscription-detail.repository';
import { UnitOfWorkRepository } from '..';
import { BillingPeriodRepository } from 'src/App/modules/admon/catalogs/billing-period/repository/period.repository';
import { SubHeadRepository } from 'src/App/modules/admon/subscriptions/repository/sub-head.repository';

export enum repo {
  REPOS = 'REPOS',
  DETAIL = 'DETAIL',
  SUB = 'SUB',
}
export const repositories: Provider[] = [
  {
    provide: repo.REPOS,
    useFactory: (db: firestoreDb): UnitOfWorkRepository => {
      fireorm.initialize(db);
      return new UnitOfWorkRepository(
        new UsersRepository(),
        new GroupsRepository(),
        new MessageRepository(),
        new WaitListRepository(),
        new ChatRepository(),
        new SubscriptionDetailRepository(db),
        new BillingPeriodRepository(db),
        new SubHeadRepository(db),
      );
    },
    scope: Scope.DEFAULT,
    inject: [FIRESTORE_DB],
  },
];

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

export enum repo {
  CHATS = 'CHATS',
  SUBDETAIL = 'SUBDETAIL',
  SUBS = 'SUBS',
  WAITLIST = 'WAITLIST',
  MESSAGES = 'MESSAGES',
  GROUPS = 'GROUPS',
  USERS = 'USERS',
}

export const repositories: Provider[] = [
  {
    provide: repo.SUBDETAIL,
    useValue: (db: firestoreDb) => new SubscriptionDetailRepository(db),
    scope: Scope.TRANSIENT,
    inject: [FIRESTORE_DB],
  },
  {
    provide: repo.USERS,
    useValue: (db: firestoreDb) => {
      try {
        const repo = new UsersRepository();
        return repo;
      } catch (error) {
        fireorm.initialize(db);
        return new UsersRepository();
      }
    },
    scope: Scope.TRANSIENT,
    inject: [FIRESTORE_DB],
  },
  {
    provide: repo.GROUPS,
    useValue: (db: firestoreDb) => {
      try {
        const repo = new GroupsRepository();
        return repo;
      } catch (error) {
        fireorm.initialize(db);
        return new GroupsRepository();
      }
    },
    scope: Scope.TRANSIENT,
    inject: [FIRESTORE_DB],
  },
  {
    provide: repo.MESSAGES,
    useValue: (db: firestoreDb) => {
      try {
        const repo = new MessageRepository();
        return repo;
      } catch (error) {
        fireorm.initialize(db);
        return new MessageRepository();
      }
    },
    scope: Scope.TRANSIENT,
    inject: [FIRESTORE_DB],
  },
  {
    provide: repo.WAITLIST,
    useValue: (db: firestoreDb) => {
      try {
        const repo = new WaitListRepository();
        return repo;
      } catch (error) {
        fireorm.initialize(db);
        return new WaitListRepository();
      }
    },
    scope: Scope.TRANSIENT,
    inject: [FIRESTORE_DB],
  },
  {
    provide: repo.CHATS,
    useValue: (db: firestoreDb) => {
      try {
        const repo = new ChatRepository();
        return repo;
      } catch (error) {
        fireorm.initialize(db);
        return new ChatRepository();
      }
    },
    scope: Scope.TRANSIENT,
    inject: [FIRESTORE_DB],
  },
];

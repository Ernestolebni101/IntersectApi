import { Global, Module } from '@nestjs/common';
import { SubscriptionDetailRepository } from '../modules/admon/subscriptions/repository/subscription-detail.repository';
import { repositories } from './database-providers/repository.provider';
import {
  firebaseProvider,
  UnitOfWorkAdapter,
  FunctionsManagerService,
} from './index';
@Global()
@Module({
  providers: [
    ...firebaseProvider,
    UnitOfWorkAdapter,
    FunctionsManagerService,
    ...repositories,
  ],
  exports: [
    ...firebaseProvider,
    FunctionsManagerService,
    ...repositories,
    UnitOfWorkAdapter,
  ],
})
export class DatabaseModule {}

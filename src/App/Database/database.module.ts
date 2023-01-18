import { Global, Module } from '@nestjs/common';
import { repositories } from './database-providers/repository.provider';
import {
  firebaseProvider,
  UnitOfWorkAdapter,
  FunctionsManagerService,
  UnitOfWorkRepository,
} from './index';
@Global()
@Module({
  providers: [
    ...firebaseProvider,
    UnitOfWorkAdapter,
    FunctionsManagerService,
    UnitOfWorkRepository,
    ...repositories,
  ],
  exports: [
    ...firebaseProvider,
    FunctionsManagerService,
    ...repositories,
    UnitOfWorkRepository,
    UnitOfWorkAdapter,
  ],
})
export class DatabaseModule {}

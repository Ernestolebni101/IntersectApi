import { Global, Module } from '@nestjs/common';
import {
  firebaseProvider,
  UnitOfWorkAdapter,
  FunctionsManagerService,
} from './index';
@Global()
@Module({
  providers: [...firebaseProvider, UnitOfWorkAdapter, FunctionsManagerService],
  exports: [...firebaseProvider, FunctionsManagerService, UnitOfWorkAdapter],
})
export class DatabaseModule {}

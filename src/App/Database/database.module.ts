import { Global, Module } from '@nestjs/common';
import { firebaseProvider } from './database-providers/firebase.provider';
import { UnitOfWorkAdapter } from './UnitOfWork/adapter.implements';
import { FunctionsManagerService } from './firebase/functionManager';

@Global()
@Module({
  providers: [...firebaseProvider, UnitOfWorkAdapter, FunctionsManagerService],
  exports: [...firebaseProvider, UnitOfWorkAdapter, FunctionsManagerService],
})
export class DatabaseModule {}

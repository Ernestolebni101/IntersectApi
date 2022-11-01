import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { firebaseProvider } from './Database/database-providers/firebase.provider';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { UnitOfWorkAdapter } from './Database/UnitOfWork/adapter.implements';
import { ConfigModule } from '@nestjs/config';
import { GroupsModule } from 'src/App/modules/groups/groups.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ChatsModule } from './modules/chats/chats.module';
import { MiddlewaresModuleModule } from './Middlewares/middlewares-module.module';
import { IntersectGateway } from './app.gateway';
import { RealtimeModule } from './shared/realtime.module';
import { FunctionsManagerService } from './Database/firebase/functionManager';
import { LoggerModule } from 'nestjs-pino';
@Global()
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            messageKey: 'message',
          },
        },
        messageKey: 'message',
      },
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UsersModule,
    GroupsModule,
    MessagesModule,
    ChatsModule,
    RealtimeModule,
    MiddlewaresModuleModule,
  ],
  controllers: [AppController],
  providers: [
    ...firebaseProvider,
    UnitOfWorkAdapter,
    AppService,
    FunctionsManagerService,
    IntersectGateway,
  ],
  exports: [
    ...firebaseProvider,
    FunctionsManagerService,
    UnitOfWorkAdapter,
    IntersectGateway,
  ],
})
export class AppModule {}

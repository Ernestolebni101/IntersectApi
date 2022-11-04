import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import {
  CorrelationMiddleware,
  CORRELATION_ID_HEADER,
} from './Middlewares/correlation.middleware';
import { Request } from 'express';
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
        customProps: (req: Request) => {
          return {
            correlationId: req[CORRELATION_ID_HEADER],
          };
        },
        autoLogging: true,
        // serializers: {
        //   req: () => undefined,
        //   res: () => undefined,
        // },
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
}

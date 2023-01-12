import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { firebaseProvider } from './Database/database-providers/firebase.provider';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { UnitOfWorkAdapter } from './Database/UnitOfWork/adapter.implements';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GroupsModule } from 'src/App/modules/groups/groups.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ChatsModule } from './modules/chats/chats.module';
import { IntersectGateway } from './app.gateway';
import { SharedModule } from './shared/shared.module';
import { FunctionsManagerService } from './Database/firebase/functionManager';
import { LoggerModule } from 'nestjs-pino';
import { IntegrationModule } from './modules/integration/index';
import {
  CorrelationMiddleware,
  CORRELATION_ID_HEADER,
} from './Middlewares/correlation.middleware';
import { Request } from 'express';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware } from './Middlewares/auth/auth.middleware';
import { AdmonModule } from './modules/admon/admon.module';
import { UsersController } from './modules/users/users.controller';
import { GroupsController } from './modules/groups/groups.controller';
import { MessagesController } from './modules/messages/controllers/messages.controller';
import { MultimediaController } from './modules/messages/controllers/multimedia.controller';
import { ChatsController } from './modules/chats/chats.controller';
import { IntegrationController } from './modules/integration/integration.controller';
import { WaitingListController } from './modules/groups/waiting-list/waiting-list.controller';
import { ScheduleModule } from '@nestjs/schedule';
@Global()
@Module({
  imports: [
    ScheduleModule.forRoot(),
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
        autoLogging: false,
        serializers: {
          req: () => undefined,
          res: () => undefined,
        },
      },
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env', '.redis.env'],
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({ global: true }),
    SharedModule,
    UsersModule,
    GroupsModule,
    MessagesModule,
    ChatsModule,
    IntegrationModule,
    AuthModule,
    AdmonModule,
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
/**
 * TODO: Implementar Clases de configuración y Módulo de Base de Datos
 */
export class AppModule implements NestModule {
  public static secretKey = '';
  public static apiKey = '';
  constructor(public configService: ConfigService) {
    AppModule.secretKey = configService.get<string>('SECRET');
    AppModule.apiKey = configService.get<string>('APIKEY');
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes(
      UsersController,
      // GroupsController,
      MessagesController,
      MultimediaController,
      ChatsController,
      IntegrationController,
      WaitingListController,
    );
  }
}

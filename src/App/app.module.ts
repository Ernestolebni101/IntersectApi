import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { firebaseProvider } from './Database/database-providers/firebase.provider';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { UnitOfWorkAdapter } from './Database/UnitOfWork/adapter.implements';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GroupsModule } from 'src/App/modules/groups/groups.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ChatsModule } from './modules/chats/chats.module';
import { MiddlewaresModuleModule } from './Middlewares/middlewares-module.module';
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
  constructor(public configService: ConfigService) {
    AppModule.secretKey = configService.get<string>('SECRET');
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
}

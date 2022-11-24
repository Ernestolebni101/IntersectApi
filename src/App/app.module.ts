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
      envFilePath: '.env',
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({ global: true }),
    SharedModule,
    IntegrationModule,
    UsersModule,
    GroupsModule,
    MessagesModule,
    ChatsModule,
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
/**
 * TODO: Implementar Clases de configuración y Módulo de Base de Datos
 */
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
  public static globalCalendar: Record<string, unknown> = {
    calendarAccount: '',
    calendarId: '',
  };
  constructor(private readonly configService: ConfigService) {
    AppModule.globalCalendar.calendarAccount = JSON.parse(
      this.configService.get<string>('CALENDAR_CREDENTIALS'),
    );
    AppModule.globalCalendar.calendarId =
      this.configService.get<string>('CALENDAR_ID');
  }
}

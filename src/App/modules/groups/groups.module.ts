import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { MulterModule } from '@nestjs/platform-express';
import { WaitingListService } from './waiting-list/waiting-list.service';
import * as Multer from 'multer';
import { GroupContext } from './group.context';
import { WaitListEventHandlers } from './waiting-list/events/handle-waitList-Events';
import { WaitingListController } from './waiting-list/waiting-list.controller';
import { UsersModule } from '../users/users.module';
import { RequestingStrategy } from './providers/providers.strategys/requesting.strategy';
import { AddingStrategy } from './providers/providers.strategys/adding.strategy';
import { NotificationService } from '../../shared/notification';
import { GroupListener } from './handlers/group.handler';
import { AuthMiddleware } from 'src/App/Middlewares/auth/auth.middleware';

@Module({
  imports: [
    UsersModule,
    MulterModule.register({
      storage: Multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  ],
  controllers: [GroupsController, WaitingListController],
  providers: [
    GroupContext,
    RequestingStrategy,
    AddingStrategy,
    GroupsService,
    NotificationService,
    GroupListener,
    WaitingListService,
    WaitListEventHandlers,
  ],
  exports: [GroupsService],
})
export class GroupsModule {}

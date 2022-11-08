import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Notification } from '../messages/messaging/notifications';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { GroupHandleEvents } from './events/handle-groups-event';
import { WaitingListService } from './waiting-list/waiting-list.service';
import * as Multer from 'multer';
import { groupProvider } from './providers/group.providers';
import { GroupContext } from './group.context';
import { WaitListEventHandlers } from './waiting-list/events/handle-waitList-Events';
import { WaitingListController } from './waiting-list/waiting-list.controller';
import { UsersModule } from '../users/users.module';
import { MessagesModule } from '../messages/messages.module';
import { RequestingStrategy } from './providers/providers.strategys/requesting.strategy';
import { AddingStrategy } from './providers/providers.strategys/adding.strategy';

@Module({
  imports: [
    UsersModule,
    MessagesModule,
    EventEmitterModule.forRoot({ global: true }),
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
    Notification,
    GroupHandleEvents,
    WaitingListService,
    WaitListEventHandlers,
  ],
  exports: [RequestingStrategy, AddingStrategy, GroupContext, GroupsService],
})
export class GroupsModule {}

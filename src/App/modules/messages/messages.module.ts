import { Module } from '@nestjs/common';
import { MessagesService } from './services/messages.service';
import { MessagesController } from './controllers/messages.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as Multer from 'multer';
import { Notification } from './messaging/notifications';
import { GroupsService } from '../groups/groups.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MessageHandleEvents } from './handlers/message.listener';
import { ChatsService } from '../chats/chats.service';
import { MultimediaService } from './services/multimedia.service';
import { MultimediaController } from './controllers/multimedia.controller';
import { GroupContext } from '../groups/group.context';
import { RequestingStrategy } from '../groups/providers/providers.strategys/requesting.strategy';
import { AddingStrategy } from '../groups/providers/providers.strategys/adding.strategy';
import { NotificationsModule } from '../notifications/notifications.module';
import { MessageListener } from '../notifications/handlers/messages.handler';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  imports: [
    EventEmitterModule.forRoot({ global: true }),
    NotificationsModule,
    MulterModule.register({
      storage: Multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  ],
  controllers: [MessagesController, MultimediaController],
  providers: [
    MessagesService,
    Notification,
    MessageHandleEvents,
    GroupContext,
    GroupsService,
    ChatsService,
    MultimediaService,
    RequestingStrategy,
    AddingStrategy,
    MessageListener,
    NotificationsService,
  ],
  exports: [Notification, MessageHandleEvents, MultimediaService],
})
export class MessagesModule {}

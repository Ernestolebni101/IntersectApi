import { Module } from '@nestjs/common';
import { MessagesService } from './services/messages.service';
import { MessagesController } from './controllers/messages.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as Multer from 'multer';
import { Notification } from './messaging/notifications';
import { GroupsService } from '../groups/groups.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MessageHandleEvents } from './events/handle-message-events';
import { ChatsService } from '../chats/chats.service';
import { MultimediaService } from './services/multimedia.service';
import { MultimediaController } from './controllers/multimedia.controller';
import { GroupContext } from '../groups/group.context';
import { groupProvider } from '../groups/providers/group.providers';

@Module({
  imports: [
    EventEmitterModule.forRoot({ global: true }),
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
    ...groupProvider,
    GroupContext,
    GroupsService,
    ChatsService,
    MultimediaService,
  ],
  exports: [Notification, MessageHandleEvents, MultimediaService],
})
export class MessagesModule {}

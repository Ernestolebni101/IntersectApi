import { Module } from '@nestjs/common';
import { MessagesService } from './services/messages.service';
import { MessagesController } from './controllers/messages.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as Multer from 'multer';
import { MultimediaService } from './services/multimedia.service';
import { MultimediaController } from './controllers/multimedia.controller';
import { MessageListener } from './handlers/message.listener';
import { NotificationService } from '../../shared/notification';
@Module({
  imports: [
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
    MessageListener,
    NotificationService,
    MultimediaService,
  ],
  exports: [MessageListener],
})
export class MessagesModule {}

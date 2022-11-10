import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MessageListener } from './handlers/messages.handler';

@Module({
  imports: [EventEmitterModule.forRoot({ global: true })],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService, MessageListener],
})
export class NotificationsModule {}

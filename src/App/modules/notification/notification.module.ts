import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MessageListener } from './handlers/messages.handler';
import { NotificationService } from './notification.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [NotificationService, MessageListener],
  exports: [NotificationService, MessageListener],
})
export class NotificationModule {}

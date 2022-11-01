import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { IntersectGateway } from '../../app.gateway';

@Module({
  imports: [EventEmitterModule.forRoot({ global: true })],
  controllers: [ChatsController],
  providers: [IntersectGateway, ChatsService],
})
export class ChatsModule {}

import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { IntersectGateway } from '../../app.gateway';
@Module({
  controllers: [ChatsController],
  providers: [IntersectGateway, ChatsService],
})
export class ChatsModule {}

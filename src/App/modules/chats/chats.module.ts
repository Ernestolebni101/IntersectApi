import { CacheModule, Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { IntersectGateway } from '../../app.gateway';
import * as redisStore from 'cache-manager-redis-store';
import { chatListener } from './handlers/chat.handler';
@Module({
  imports: [
    CacheModule.register({
      useFactory: () => ({
        store: redisStore,
        host: 'redis-11088.c89.us-east-1-3.ec2.cloud.redislabs.com',
        port: 11088,
        password: 'R5qCdxGFZQwPNS22NGRul6XIsW5yUH50',
      }),
    }),
  ],
  controllers: [ChatsController],
  providers: [IntersectGateway, ChatsService, chatListener],
})
export class ChatsModule {}

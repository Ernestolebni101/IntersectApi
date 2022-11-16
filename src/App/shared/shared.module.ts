import { Global, Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { RedisPropagatorModule } from './redis-propagator/redis-propagator.module';
import { RedisModule } from './redis/redis.module';
import { SocketStateModule } from './sockets/socket-state.module';

@Global()
@Module({
  imports: [
    NotificationModule,
    RedisModule,
    RedisPropagatorModule,
    SocketStateModule,
  ],
  exports: [RedisModule, RedisPropagatorModule, SocketStateModule],
})
export class SharedModule {}

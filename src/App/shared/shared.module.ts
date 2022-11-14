import { Global, Module } from '@nestjs/common';
import { RedisPropagatorModule } from './redis-propagator/redis-propagator.module';
import { RedisModule } from './redis/redis.module';
import { SocketStateModule } from './sockets/socket-state.module';

@Global()
@Module({
  imports: [RedisModule, RedisPropagatorModule, SocketStateModule],
  exports: [RedisModule, RedisPropagatorModule, SocketStateModule],
})
export class SharedModule {}

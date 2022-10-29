import { Module } from '@nestjs/common';
import { rediProvider } from './redis.providers';
import { RedisService } from './redis.service';
@Module({
  providers: [...rediProvider, RedisService],
  exports: [...rediProvider, RedisService],
})
export class RedisModule {}

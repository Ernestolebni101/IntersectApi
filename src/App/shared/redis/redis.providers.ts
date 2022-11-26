/* eslint-disable prettier/prettier */
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import {REDIS_CHAT_SUSCRIBER_CLIENT, REDIS_PUBLISHER_CLIENT,REDIS_SUBSCRIBER_CLIENT} from './redis.constants';
export type RedisClient = Redis;

export const rediProvider: Provider[] = [
    {
        useFactory: (config:ConfigService): RedisClient => {
          return new Redis({
            host: config.get<string>('REDIS_HOST'),
            port: config.get<number>('REDIS_PORT'),
            password: config.get<string>('REDIS_CREDS'),
          });
        },
        provide: REDIS_SUBSCRIBER_CLIENT,
        inject: [ConfigService]
    },
      {
        useFactory: (config:ConfigService): RedisClient => {
          return new Redis({
            host: config.get<string>('REDIS_HOST'),
            port: config.get<number>('REDIS_PORT'),
            password: config.get<string>('REDIS_CREDS'),
          });
        },
        provide: REDIS_PUBLISHER_CLIENT,
        inject: [ConfigService]
      },
      {
        useFactory: (config:ConfigService): RedisClient => {
          return new Redis({
            host: config.get<string>('REDIS_HOST_DEV'),
            port: config.get<number>('REDIS_PORT_DEV'),
            password: config.get<string>('REDIS_CREDS_DEV'),
          });
        },
        provide: REDIS_CHAT_SUSCRIBER_CLIENT,
        inject: [ConfigService]
      }
];
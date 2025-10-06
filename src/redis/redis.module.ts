import { Module } from '@nestjs/common';
import { redisOptionsModuleFactory } from './redis.config';
import { createRedisConnection } from './redis.service';
import { REDIS_MODULE_OPTIONS, REDIS_TOKEN } from 'src/utils/constants';
import Redis from 'ioredis';

const config = redisOptionsModuleFactory();
const { url } = config.config;

@Module({
  providers: [
    {
      provide: REDIS_MODULE_OPTIONS,
      useValue: {
        url,
      },
    },
    {
      inject: [REDIS_MODULE_OPTIONS],
      provide: REDIS_TOKEN,
      useFactory: async (): Promise<Redis> => {
        const client = createRedisConnection(config);

        return client;
      },
    },
  ],
  exports: [REDIS_TOKEN],
})
export class RedisModule {}

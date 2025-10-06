import * as ioredis from 'ioredis';
import { kill } from 'process';
import * as dotenv from 'dotenv';
import { isDev } from 'src/utils/helpers';

export interface RedisModuleOptions {
  config: ioredis.RedisOptions & { url?: string };
}
dotenv.config();
export const redisOptionsModuleFactory = (): RedisModuleOptions => {
  const options: RedisModuleOptions = {
    config: {
      host: isDev(process.env.NODE_ENV) ? 'localhost' : process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USERNAME,
      retryStrategy: () => {
        kill(process.pid, 'SIGTERM');
      },
    },
  };

  return options;
};

import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { UserAuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [DatabaseModule, PostModule, UserAuthModule, RedisModule],
})
export class AppModule {}

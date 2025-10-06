import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/database/models/posts.model';
import { RedisModule } from 'src/redis/redis.module';
import { PostRepository } from './post.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Posts]), RedisModule],
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    JwtService,
    ConfigService,
  ],
})
export class PostModule {}

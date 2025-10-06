import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostDtoValidator } from './dto/post-validator.dto';
import { Posts } from 'src/database/models/posts.model';
import { PostResponse } from './types';
import { REDIS_TOKEN } from 'src/utils/constants';
import Redis from 'ioredis';
import { getWhere, QueryParams } from 'src/utils/filter-helper';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject(REDIS_TOKEN)
    private readonly redis: Redis,
    private readonly postRepository: PostRepository,
  ) {}

  async create(post: Omit<PostDtoValidator, 'createdAt'>): Promise<PostResponse> {

    return this.postRepository.save({...post, user:{userId:post.userId}, createdAt: new Date()});
  }

  async findOne(postId: string): Promise<PostResponse> {
    const redisKey = `post:${postId}`;

    if ((await this.redis.exists(redisKey)) === 0) {
      const post = await this.postRepository.findOne(postId);

      if(!post){
        throw new NotFoundException(`Post not found`)
      }

      await this.redis.set(redisKey, JSON.stringify(post));

      return post;
    }

    const cachedPost = await this.redis.get(`post:${postId}`);

    return JSON.parse(cachedPost) as Posts;
  }

  async findMany(
    postFilters: QueryParams
  ): Promise<{ data: PostDto[]; total: number }> {
    const {filter:rawFilter, pagination,order} = postFilters
    const {skip,limit}=pagination

    const filter = getWhere(rawFilter)

    return this.postRepository.findMany({filter,skip,limit,order});
  }

  async update(postId: string, payload: Partial<Posts>): Promise<PostResponse> {
    const redisKey = `post:${postId}`;
    const updateRes = await this.postRepository.update(postId, payload);

    if (!updateRes.affected) {
      throw new NotFoundException(`Post #(${postId}) does not exist`);
    }
    const updatedPost = await this.postRepository.findOne(postId);

    if (await this.redis.exists(redisKey) !== 0) {
      await this.redis.del(redisKey);

      await this.redis.set(redisKey, JSON.stringify(updatedPost));
    }

    return updatedPost;
  }

  async delete(postId: string): Promise<PostResponse> {
    const redisKey = `post:${postId}`;
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new NotFoundException(`Post ${post.postId} not found`);
    }

    await this.postRepository.delete(post.postId);

    if (await this.redis.exists(redisKey)) {
      await this.redis.del(redisKey);
    }

    return post;
  }
}

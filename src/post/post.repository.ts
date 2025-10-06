import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/database/models/posts.model';
import {
  DeleteResult,
  FindOptionsOrder,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { PostResponse, PostsSearchParams } from './types';
import { PostDtoValidator } from './dto/post-validator.dto';
import { PostDto } from './dto/post.dto';

export class PostRepository {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
  ) {}

  async save<T extends Pick<Posts, 'name' | 'description'>>(
    payload: T,
  ): Promise<Posts> {
    return this.postRepository.save(payload);
  }
  async findOne(postId: string): Promise<PostResponse | undefined> {
    const postData = await this.postRepository.findOne({ where:{postId},relations:['user'] });

    if(!postData){
      return undefined
    }

    const post = {...postData,user:{userId: postData.user.userId, login: postData.user.login, createdAt: new Date(postData.user.createdAt)}}

    return post
  }

  async findMany(
    {filter,order,skip,limit}: {filter?: Record<string,string>,order?:FindOptionsOrder<Posts>,skip: number, limit: number }
  ): Promise<{ data: PostDto[]; total: number }> {
    const [posts,total] = await this.postRepository.findAndCount({
      where: filter,
      order,
      skip,
      take: limit,
      relations:{
        user: true
      }
    })

    return {data: posts.map(post=>new PostDto(post)),total}
  }

  async update(postId: string, payload: Partial<Posts>): Promise<UpdateResult> {
    return this.postRepository.update({ postId }, {...payload, modifiedAt: new Date()});
  }

  async delete(postId: string): Promise<DeleteResult> {
    return this.postRepository.delete({ postId });
  }
}

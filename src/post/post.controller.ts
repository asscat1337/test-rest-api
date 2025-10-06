import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDtoValidator } from './dto/post-validator.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { PostResponse } from './types';
import { QueryParams } from 'src/utils/filter-helper';
import { PostDto } from './dto/post.dto';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  async createPostController(@Req() request: Request, @Body() postData: CreatePostDtoValidator): Promise<PostResponse> {
    const user = request['user']

    if(!user){
      throw new UnauthorizedException(`Not found user from session`)
    }

    return this.postService.create({...postData, userId: user.userId});
  }

  @Get()
  async findMany(
    @QueryParams() postFilters: QueryParams
  ): Promise<{ data: PostDto[]; total: number }> {
    return this.postService.findMany(postFilters);
  }

  @Get(':postId')
  async findOne(@Param("postId") postId: string): Promise<PostResponse> {
    return this.postService.findOne(postId);
  }

  @Patch(':postId')
  async update(
    @Param("postId") postId: string,
    @Body() updatePostDto: Record<string, string>,
  ): Promise<PostResponse> {
    return this.postService.update(postId, updatePostDto);
  }

  @Delete(':postId')
  async deletePost(@Param("postId") postId: string): Promise<PostResponse> {
    return this.postService.delete(postId);
  }
}

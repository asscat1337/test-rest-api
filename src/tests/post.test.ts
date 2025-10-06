import { PostService } from '../post/post.service';
import { CreatePostDtoValidator } from '../post/dto/post-validator.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../post/post.controller';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { PostResponse } from '../post/types';
import { QueryParams } from '../utils/filter-helper';
import { PostDto } from '../post/dto/post.dto';

describe('PostController', () => {
  let controller: PostController;
  let postService: PostService;

  const mockPostService = {
    create: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPostController', () => {
    const mockRequest = {
      user: { userId: 'userId' },
    } as any;

    const mockPostData = {
      name: 'Test Post',
      description: 'Test content',
    } as CreatePostDtoValidator;

    const mockPostResponse: PostResponse = {
      postId: 'post123',
      name: 'Test Post',
      description: 'Test content',
      createdAt: new Date(),
      modifiedAt: null,
      user: {
        userId: 'userId',
        login: 'user@example.com',
        createdAt: new Date(),
      },
    } as PostResponse;

    it('should create a post successfully', async () => {
      mockPostService.create.mockResolvedValue(mockPostResponse);

      const result = await controller.createPostController(
        mockRequest,
        mockPostData,
      );

      expect(mockPostService.create).toHaveBeenCalledWith({
        ...mockPostData,
        userId: 'userId',
      });
      expect(result).toEqual(mockPostResponse);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const requestWithoutUser = {} as any;

      await expect(
        controller.createPostController(requestWithoutUser, mockPostData),
      ).rejects.toThrow(
        new UnauthorizedException('Not found user from session'),
      );

      expect(mockPostService.create).not.toHaveBeenCalled();
    });
  });

  describe('findMany', () => {
    const mockQueryParams = {
      pagination: { skip: 0, limit: 10 },
    } as QueryParams;

    const mockResponse = {
      data: [{ postId: 'post1', name: 'Post 1' }] as PostDto[],
      total: 1,
    };

    it('should return paginated posts', async () => {
      mockPostService.findMany.mockResolvedValue(mockResponse);

      const result = await controller.findMany(mockQueryParams);

      expect(mockPostService.findMany).toHaveBeenCalledWith(mockQueryParams);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    const mockPostId = 'post123';
    const mockPostResponse = {
      postId: 'post123',
      name: 'Test Post',
    } as PostResponse;

    it('should return a single post', async () => {
      mockPostService.findOne.mockResolvedValue(mockPostResponse);

      const result = await controller.findOne(mockPostId);

      expect(mockPostService.findOne).toHaveBeenCalledWith(mockPostId);
      expect(result).toEqual(mockPostResponse);
    });
  });

  describe('update', () => {
    const mockPostId = 'post123';
    const mockUpdateData = { title: 'Updated Title' };
    const mockPostResponse = {
      postId: 'post123',
      description: 'Updated Title',
      name: 'Test Post name',
    } as PostResponse;

    it('should update a post', async () => {
      mockPostService.update.mockResolvedValue(mockPostResponse);

      const result = await controller.update(mockPostId, mockUpdateData);

      expect(mockPostService.update).toHaveBeenCalledWith(
        mockPostId,
        mockUpdateData,
      );
      expect(result).toEqual(mockPostResponse);
    });
  });

  describe('deletePost', () => {
    const mockPostId = 'post123';
    const mockPostResponse = {
      postId: 'post123',
      name: 'Test Post',
      description: 'Test Post Description',
    } as PostResponse;

    it('should delete a post', async () => {
      mockPostService.delete.mockResolvedValue(mockPostResponse);

      const result = await controller.deletePost(mockPostId);

      expect(mockPostService.delete).toHaveBeenCalledWith(mockPostId);
      expect(result).toEqual(mockPostResponse);
    });
  });
});

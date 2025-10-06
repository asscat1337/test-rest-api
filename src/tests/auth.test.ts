import 'reflect-metadata'; 
import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthController } from '../../src/auth/auth.controller';
import { UserAuthService } from '../../src/auth/auth.service';
import { RegisterUserDto, LoginUserDto } from '../../src/auth/dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';

describe('UserAuthController', () => {
  let controller: UserAuthController;
  let service: UserAuthService;

  const mockUserAuthService = {
    registerUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthController],
      providers: [
        {
          provide: UserAuthService,
          useValue: mockUserAuthService,
        },
      ],
    }).compile();

    controller = module.get<UserAuthController>(UserAuthController);
    service = module.get<UserAuthService>(UserAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register user successfully', async () => {
      const dto: RegisterUserDto = {
        login: 'testuser',
        email: 'test@example.com',
        password: '123456',
      };

      const expected = {
        userId: 'uuid',
        login: 'testuser',
        email: 'test@example.com',
      };

      mockUserAuthService.registerUser.mockResolvedValue(expected);

      const result = await controller.registerUser(dto);

      expect(service.registerUser).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });

    it('should throw error when service fails', async () => {
      const dto: RegisterUserDto = {
        login: 'baduser',
        email: 'bad@example.com',
        password: '123',
      };

      mockUserAuthService.registerUser.mockRejectedValue(
        new Error('Registration failed'),
      );

      await expect(controller.registerUser(dto)).rejects.toThrow('Registration failed');
    });
  });

  describe('loginUser', () => {
    it('should login and return tokens', async () => {
      const dto: LoginUserDto = {
        login: 'testuser',
        password: '123456',
      };

      const expected = {
        accessToken: 'jwt-access',
        refreshToken: 'jwt-refresh',
        userId: 'uuid',
      };

      mockUserAuthService.login.mockResolvedValue(expected);

      const mockRes = {
        cookie: jest.fn(),
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const result = await controller.loginUser(mockRes, dto);

      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const dto: LoginUserDto = {
        login: 'wronguser',
        password: 'wrongpass',
      };

      mockUserAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      const mockRes = {
        cookie: jest.fn(),
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await expect(controller.loginUser(mockRes, dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});


import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserAuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { UserLoginResponse, UserRegisterResponse } from './types';
import type { Response } from 'express';

@Controller('auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) response: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<UserLoginResponse> {
    const res = await this.userAuthService.login(loginUserDto);
    response.cookie('accessToken', res.accessToken, {
      httpOnly: true,
      secure: false,
    });

    return res;
  }

  @Post('register')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserRegisterResponse> {
    return this.userAuthService.registerUser(registerUserDto);
  }
}

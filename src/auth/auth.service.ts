import { hash, compare, genSalt } from 'bcrypt';

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { SALT_ROUND } from '../utils/constants';
import { UserAuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserAuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UserAuthRepository,
    private readonly configService: ConfigService,
  ) {}

  async login(
    payload: LoginUserDto,
  ): Promise<{ userId: string; accessToken: string; refreshToken: string }> {
    const { login, password } = payload;

    const user = await this.userRepository.getUserByLogin(login);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const isPasswordCompared = await compare(password, user.password);

    if (!isPasswordCompared) {
      throw new UnauthorizedException(`Invalid password`);
    }

    const jwtPayload = { login, userId: user.userId };

    const jwtAccessTokenExpiration =
      +this.configService.getOrThrow('JWT_ACCESS_TOKEN_TTL') * 1000;
    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: jwtAccessTokenExpiration,
    });

    const jwtRefreshTokenExpiration =
      +this.configService.get('JWT_REFRESH_TOKEN_TTL') * 60 * 60 * 1000;
    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: jwtRefreshTokenExpiration,
    });

    return { userId: user.userId, accessToken, refreshToken };
  }
  async registerUser(
    payload: RegisterUserDto,
  ): Promise<{ login: string; userId: string; createdAt: Date }> {
    const { login, password, email } = payload;

    const isUserExist = await this.userRepository.getUserByLogin(login);

    if (isUserExist) {
      throw new ConflictException(`User already exist`);
    }

    const salt = await genSalt(SALT_ROUND);
    const hashedPassword = await hash(password, salt);

    const newUser = await this.userRepository.save({
      login,
      password: hashedPassword,
      email,
    });

    return {
      login: newUser.login,
      userId: newUser.userId,
      createdAt: newUser.createdAt,
    };
  }
}

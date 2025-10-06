import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserAuthController } from './auth.controller';
import { UserAuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/database/models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/auth/jwt/jwt.config';
import { UserAuthRepository } from './auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService, UserAuthRepository],
})
export class UserAuthModule {}

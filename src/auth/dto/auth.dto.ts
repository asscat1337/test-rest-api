import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEmpty,
} from 'class-validator';

export class RegisterUserDto {
  //NOTE: Required fields
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  //NOTE: Non required fields
  @IsEmail()
  @IsEmpty()
  email: string;
}

export class LoginUserDto {
  //NOTE: Required fields
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

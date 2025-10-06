import { IsNotEmpty, IsString, MinLength, IsDate } from 'class-validator';

export class CreatePostDtoValidator {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name: string;

  @IsNotEmpty()
  @MinLength(1)
  description: string;
}

export class PostDtoValidator extends CreatePostDtoValidator {

  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  userId: string;
}

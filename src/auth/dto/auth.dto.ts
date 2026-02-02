import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;
}

export class AuthLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

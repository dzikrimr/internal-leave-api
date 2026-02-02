import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class AuthRegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({ example: 'John Doe', minLength: 2 })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @ApiProperty({ enum: UserRole, required: false, example: 'user', description: 'User role (user or admin)' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class AuthLoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;
}

import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { AuthRegisterDto, AuthLoginDto } from '../dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @HttpCode(HttpStatus.CREATED)
  register(@Body(new ValidationPipe()) body: AuthRegisterDto) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful - returns JWT token' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid credentials' })
  @HttpCode(HttpStatus.OK)
  login(@Body(new ValidationPipe()) body: AuthLoginDto) {
    return this.authService.login(body.email, body.password);
  }
}

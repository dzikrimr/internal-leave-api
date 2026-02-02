import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthRegisterDto, AuthLoginDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body(new ValidationPipe()) body: AuthRegisterDto) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body(new ValidationPipe()) body: AuthLoginDto) {
    return this.authService.login(body.email, body.password);
  }
}

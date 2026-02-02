import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { AuthRegisterDto, AuthLoginDto } from '../dto/auth.dto';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Authentication Controller
 * Handles user registration and login for the Internal Leave Request API
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a new regular user
   * Creates a user account with default 'user' role
   */
  @Post('register/user')
  @ApiOperation({ 
    summary: 'Register a new regular user',
    description: 'Creates a new user account with default role "user". The user can then login and submit leave requests.'
  })
  @ApiResponse({ status: 201, description: 'User successfully registered. Returns user details and access token.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed (invalid email format, password too short, or email already exists)' })
  @ApiBadRequestResponse({ description: 'Validation error - check request body format' })
  @HttpCode(HttpStatus.CREATED)
  registerUser(@Body(new ValidationPipe()) body: AuthRegisterDto) {
    return this.authService.register(body.email, body.password, body.name, UserRole.USER);
  }

  /**
   * Register a new admin user
   * Creates an admin account with 'admin' role for managing leave requests
   */
  @Post('register/admin')
  @ApiOperation({ 
    summary: 'Register a new admin user',
    description: 'Creates a new admin account with role "admin". Admin can approve/reject leave requests and manage users.'
  })
  @ApiResponse({ status: 201, description: 'Admin successfully registered. Returns user details and access token.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed (invalid email format, password too short, or email already exists)' })
  @ApiBadRequestResponse({ description: 'Validation error - check request body format' })
  @HttpCode(HttpStatus.CREATED)
  registerAdmin(@Body(new ValidationPipe()) body: AuthRegisterDto) {
    return this.authService.register(body.email, body.password, body.name, UserRole.ADMIN);
  }

  /**
   * User login
   * Authenticates user and returns JWT access token
   */
  @Post('login')
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticates user with email and password. Returns JWT access token for subsequent API calls.'
  })
  @ApiResponse({ status: 200, description: 'Login successful. Returns JWT access token.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid email or password' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials - email or password is incorrect' })
  @HttpCode(HttpStatus.OK)
  login(@Body(new ValidationPipe()) body: AuthLoginDto) {
    return this.authService.login(body.email, body.password);
  }
}

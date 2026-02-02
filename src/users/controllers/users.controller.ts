import { Controller, Get, Put, Delete, Param, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiForbiddenResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/user.dto';

/**
 * Users Controller
 * Handles user management operations for the Internal Leave Request API
 * All endpoints require admin role for access
 */
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Get all users
   * Retrieves a list of all registered users in the system
   */
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get all users (Admin only)',
    description: 'Retrieves a complete list of all registered users including their email, name, role, and registration date.'
  })
  @ApiResponse({ status: 200, description: 'Returns an array of all users in the system.' })
  @ApiForbiddenResponse({ description: 'Access denied - only admins can access this endpoint.' })
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Get user by ID
   * Retrieves detailed information about a specific user
   */
  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get user by ID (Admin only)',
    description: 'Retrieves detailed information about a specific user including their email, name, role, and account creation date.'
  })
  @ApiResponse({ status: 200, description: 'Returns the user details.' })
  @ApiResponse({ status: 404, description: 'User not found - no user exists with the provided ID.' })
  @ApiForbiddenResponse({ description: 'Access denied - only admins can access this endpoint.' })
  @ApiNotFoundResponse({ description: 'User with the specified ID does not exist' })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  /**
   * Update user
   * Modifies user information such as name or role
   */
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Update user (Admin only)',
    description: 'Updates user information. Can modify name or role. The email cannot be changed after registration.'
  })
  @ApiResponse({ status: 200, description: 'User updated successfully. Returns the updated user details.' })
  @ApiResponse({ status: 404, description: 'User not found - no user exists with the provided ID.' })
  @ApiForbiddenResponse({ description: 'Access denied - only admins can access this endpoint.' })
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) data: UpdateUserDto,
  ) {
    return this.usersService.update(id, data);
  }

  /**
   * Delete user
   * Removes a user from the system (irreversible action)
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Delete user (Admin only)',
    description: 'Permanently removes a user from the system. This action is irreversible and will also delete all leave requests associated with this user.'
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found - no user exists with the provided ID.' })
  @ApiForbiddenResponse({ description: 'Access denied - only admins can access this endpoint.' })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}

import { Controller, Get, Put, Delete, Param, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @ApiForbiddenResponse({ description: 'Only admins can access this endpoint' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Only admins can access this endpoint' })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Only admins can access this endpoint' })
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) data: UpdateUserDto,
  ) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Only admins can access this endpoint' })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}

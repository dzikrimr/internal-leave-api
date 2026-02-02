import { Controller, Post, Get, Put, Param, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { LeavesService } from '../services/leaves.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { CreateLeaveDto, UpdateLeaveStatusDto } from '../dto/leave.dto';

@ApiTags('Leaves')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private leavesService: LeavesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new leave request' })
  @ApiResponse({ status: 201, description: 'Leave request created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  create(@Body(new ValidationPipe()) body: CreateLeaveDto, @Request() req) {
    const leaveData = {
      ...body,
      user: { id: req.user.userId } as any,
    };
    return this.leavesService.create(leaveData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leave requests' })
  @ApiResponse({ status: 200, description: 'Returns all leave requests' })
  findAll() {
    return this.leavesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get leave request by ID' })
  @ApiResponse({ status: 200, description: 'Returns the leave request' })
  @ApiResponse({ status: 404, description: 'Leave request not found' })
  findOne(@Param('id') id: number) {
    return this.leavesService.findOne(id);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update leave request status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'Leave request not found' })
  @ApiForbiddenResponse({ description: 'Only admins can update leave status' })
  updateStatus(
    @Param('id') id: number,
    @Body(new ValidationPipe()) body: UpdateLeaveStatusDto,
  ) {
    return this.leavesService.updateStatus(id, body.status);
  }
}

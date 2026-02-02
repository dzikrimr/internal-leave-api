import { Controller, Post, Get, Put, Param, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiForbiddenResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { LeavesService } from '../services/leaves.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { CreateLeaveDto } from '../dto/leave.dto';

/**
 * Leaves Controller
 * Handles all leave request operations for the Internal Leave Request API
 * Users can create and view their own leave requests
 * Admins can approve/reject leave requests and view all requests
 */
@ApiTags('Leaves')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private leavesService: LeavesService) {}

  /**
   * Create a new leave request
   * Allows authenticated users to submit a new leave request
   */
  @Post()
  @ApiOperation({ 
    summary: 'Create a new leave request',
    description: 'Submit a new leave request. Available leave types: ANNUAL, SICK, PERSONAL, and other approved leave types.'
  })
  @ApiResponse({ status: 201, description: 'Leave request created successfully. Returns the created leave request details.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed (missing required fields, invalid date format, or invalid leave type)' })
  create(@Body(new ValidationPipe()) body: CreateLeaveDto, @Request() req) {
    const leaveData = {
      ...body,
      user: { id: req.user.userId } as any,
    };
    return this.leavesService.create(leaveData);
  }

  /**
   * Get all leave requests
   * Returns all leave requests in the system (admin sees all, users see their own)
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all leave requests',
    description: 'Retrieves a list of all leave requests. Admin users can see all requests, regular users can only see their own.'
  })
  @ApiResponse({ status: 200, description: 'Returns an array of leave requests with user details.' })
  findAll() {
    return this.leavesService.findAll();
  }

  /**
   * Get a leave request by ID
   * Retrieves detailed information about a specific leave request
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get leave request by ID',
    description: 'Retrieves detailed information about a specific leave request including status, dates, and reason.'
  })
  @ApiResponse({ status: 200, description: 'Returns the leave request details.' })
  @ApiResponse({ status: 404, description: 'Leave request not found - no request exists with the provided ID.' })
  @ApiNotFoundResponse({ description: 'Leave request with the specified ID does not exist' })
  findOne(@Param('id') id: number) {
    return this.leavesService.findOne(id);
  }

  /**
   * Approve a leave request
   * Admin-only endpoint to approve a pending leave request
   */
  @Put(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Approve a leave request (Admin only)',
    description: 'Approves a pending leave request. Only users with admin role can access this endpoint.'
  })
  @ApiResponse({ status: 200, description: 'Leave request approved successfully.' })
  @ApiResponse({ status: 404, description: 'Leave request not found.' })
  @ApiForbiddenResponse({ description: 'Access denied - only admins can approve leave requests.' })
  approve(@Param('id') id: number) {
    return this.leavesService.updateStatus(id, 'APPROVED');
  }

  /**
   * Reject a leave request
   * Admin-only endpoint to reject a pending leave request
   */
  @Put(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Reject a leave request (Admin only)',
    description: 'Rejects a pending leave request. Only users with admin role can access this endpoint.'
  })
  @ApiResponse({ status: 200, description: 'Leave request rejected successfully.' })
  @ApiResponse({ status: 404, description: 'Leave request not found.' })
  @ApiForbiddenResponse({ description: 'Access denied - only admins can reject leave requests.' })
  reject(@Param('id') id: number) {
    return this.leavesService.updateStatus(id, 'REJECTED');
  }
}

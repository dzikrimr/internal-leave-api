import { Controller, Post, Get, Put, Param, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { LeavesService } from '../services/leaves.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { CreateLeaveDto, UpdateLeaveStatusDto } from '../dto/leave.dto';

@UseGuards(JwtAuthGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private leavesService: LeavesService) {}

  @Post()
  create(@Body(new ValidationPipe()) body: CreateLeaveDto, @Request() req) {
    const leaveData = {
      ...body,
      user: { id: req.user.userId } as any,
    };
    return this.leavesService.create(leaveData);
  }

  @Get()
  findAll() {
    return this.leavesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.leavesService.findOne(id);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body(new ValidationPipe()) body: UpdateLeaveStatusDto,
  ) {
    return this.leavesService.updateStatus(id, body.status);
  }
}

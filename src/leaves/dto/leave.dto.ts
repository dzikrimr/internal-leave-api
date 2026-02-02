import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveDto {
  @ApiProperty({ example: 'Sick Leave', description: 'Type of leave (e.g., Annual, Sick, Personal)' })
  @IsString()
  type: string;

  @ApiProperty({ example: '2025-01-15', description: 'Start date in YYYY-MM-DD format' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-01-17', description: 'End date in YYYY-MM-DD format' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'Not feeling well', required: false, description: 'Reason for leave' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateLeaveStatusDto {
  @ApiProperty({ example: 'approved', description: 'New status (pending, approved, rejected)' })
  @IsString()
  status: string;
}

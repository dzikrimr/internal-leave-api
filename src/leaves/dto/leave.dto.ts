import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateLeaveDto {
  @IsString()
  type: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateLeaveStatusDto {
  @IsString()
  status: string;
}

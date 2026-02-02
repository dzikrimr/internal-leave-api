import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leave } from './entities/leave.entity';
import { User } from '../users/entities/user.entity';
import { LeavesService } from './services/leaves.service';
import { LeavesController } from './controllers/leaves.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Leave, User])],
  providers: [LeavesService],
  controllers: [LeavesController],
})
export class LeavesModule {}

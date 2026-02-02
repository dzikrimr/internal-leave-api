import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leave } from '../entities/leave.entity';

@Injectable()
export class LeavesService {
  constructor(
    @InjectRepository(Leave)
    private leaveRepo: Repository<Leave>,
  ) {}

  create(data: Partial<Leave>) {
    return this.leaveRepo.save(data);
  }

  findAll() {
    return this.leaveRepo.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.leaveRepo.findOne({ where: { id }, relations: ['user'] });
  }

  updateStatus(id: number, status: string) {
    return this.leaveRepo.update(id, { status });
  }

  remove(id: number) {
    return this.leaveRepo.delete(id);
  }
}

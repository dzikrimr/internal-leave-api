import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.userRepo.find({ relations: ['leaves'] });
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id }, relations: ['leaves'] });
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  update(id: number, data: Partial<User>) {
    return this.userRepo.update(id, data);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }
}

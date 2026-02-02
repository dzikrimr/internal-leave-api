import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ nullable: true })
  reason: string;

  @ManyToOne(() => User, (user) => user.leaves, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

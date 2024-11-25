import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from 'typeorm';
import { StatusEnum } from './status.enum';
import { BaseEntity } from '../entities/base.entity';


@Entity('todos')
export class TodoEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    description: string;
  
    @Column({
      type: 'enum',
      enum: StatusEnum,
      default: StatusEnum.PENDING,
    })
    status: StatusEnum;
  }

  
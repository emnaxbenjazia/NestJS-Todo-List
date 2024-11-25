import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'CreatedAt' })
  readonly CreatedAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'UpdatedAt' })
  UpdatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'DeletedAt' })
  DeletedAt: Date;
}

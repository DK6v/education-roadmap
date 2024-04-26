import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Property } from '@/decorators/property.decorator';

@Entity()
export class User {
  @Property()
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

  @Property()
  @Column({
    type: 'varchar',
    length: 250,
    unique: true,
  })
  email!: string;

  @Property()
  @Column()
  firstName!: string;

  @Property()
  @Column()
  lastName!: string;

  @Property()
  @Column({
    type: 'timestamp',
  })
  @CreateDateColumn()
  createdAt!: string;

  @Property()
  @Column({
    type: 'timestamp',
  })
  @DeleteDateColumn()
  deletedAt?: string;
}

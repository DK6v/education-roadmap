import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Property } from '@decorators/property.decorator';

@Entity()
export class User {

    @Property()
    @PrimaryGeneratedColumn()
    id: number;

    @Property()
    @Column()
    email: string;

    @Property()
    @Column()
    first_name: string;

    @Property()
    @Column()
    last_name: string;

    @Property()
    @Column()
    created_at: string;

    @Property()
    @Column()
    deleted_at: string;
}

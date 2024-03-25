import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    created_at: string;

    @Column()
    deleted_at: string;
}

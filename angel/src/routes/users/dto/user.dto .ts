import {
    IsOptional,
    IsString,
    IsEmail,
    IsNotEmpty,
    MaxLength,
    IsDateString
} from 'class-validator';

import { User } from '../entities/user.entity';

export class UserDto {

    constructor(user: User) {
        this.id = user.id,
        this.email = user.email,
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.created_at = user.created_at,
        this.deleted_at = user.deleted_at
    }

    @IsNotEmpty()
    id: number;

    @IsEmail()
    @MaxLength(255)
    email: string;

    @IsString()
    @MaxLength(100)
    first_name: string;

    @IsString()
    @MaxLength(100)
    last_name: string;

    @IsDateString()
    created_at: string;

    @IsOptional()
    @IsDateString()
    deleted_at?: string;
}

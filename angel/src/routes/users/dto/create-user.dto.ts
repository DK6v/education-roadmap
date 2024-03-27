import { IsString, IsEmail, MaxLength } from 'class-validator';

export class CreateUserDto {

    @IsEmail()
    @MaxLength(255)
    email: string;

    @IsString()
    @MaxLength(100)
    first_name: string;

    @IsString()
    @MaxLength(100)
    last_name: string;
}

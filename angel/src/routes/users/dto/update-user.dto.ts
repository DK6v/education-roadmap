import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, MaxLength } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @MaxLength(100)
    first_name: string;

    @IsString()
    @MaxLength(100)
    last_name: string;
}

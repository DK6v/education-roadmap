import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

// Sample query:
// {"email": "user_1@example.com", "first_name": "first_name_1", "last_name": "last_name_2"}

export class CreateUserDto {
  @ApiProperty({
    name: 'email',
    type: String,
    description: 'Email address',
    nullable: false,
  })
  @IsEmail()
  @MaxLength(255)
  @Expose({
    name: 'email',
  })
  email: string;

  @ApiProperty({
    name: 'first_name',
    type: String,
    description: 'First name of the user',
    nullable: false,
  })
  @IsString()
  @MaxLength(100)
  @Expose({
    name: 'first_name',
  })
  firstName: string;

  @ApiProperty({
    name: 'last_name',
    type: String,
    description: 'Last name of the user',
    nullable: false,
  })
  @IsString()
  @MaxLength(100)
  @Expose({
    name: 'last_name',
  })
  lastName: string;
}

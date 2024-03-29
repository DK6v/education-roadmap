import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({
    name: 'first_name',
    type: String,
    description: 'First name',
    nullable: true,
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
    description: 'Last name',
    nullable: true,
  })
  @IsString()
  @MaxLength(100)
  @Expose({
    name: 'last_name',
  })
  last_name: string;
}

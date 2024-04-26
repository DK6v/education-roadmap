import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { Expose } from 'class-transformer';

import { Property, getProperties } from '@/decorators/property.decorator';
import { User } from '../entities/user.entity';

export class UserDto {
  constructor(user: User | null) {
    if (user != null) {
      getProperties(UserDto).forEach((key) => {
        this[key] = user[key] ?? undefined;
      });
    }
  }

  @Property()
  @ApiProperty({
    name: 'id',
    type: Number,
    description: 'Unique ID',
    nullable: false,
  })
  @IsNumber()
  @IsNotEmpty()
  @Expose({
    name: 'id',
  })
  id!: number;

  @Property()
  @ApiProperty({
    name: 'email',
    type: String,
    description: 'Email address',
    nullable: false,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  @Expose({
    name: 'email',
  })
  email!: string;

  @Property()
  @ApiProperty({
    name: 'first_name',
    type: String,
    description: 'First name',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Expose({
    name: 'first_name',
  })
  firstName!: string;

  @Property()
  @ApiProperty({
    name: 'last_name',
    type: String,
    description: 'Last name',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Expose({ name: 'last_name' })
  lastName!: string;

  @Property()
  @ApiProperty({
    name: 'created_at',
    type: String,
    description: 'Date and time of creation in UTC (ISO 8601)',
    nullable: false,
  })
  @IsDateString()
  @IsNotEmpty()
  @Expose({
    name: 'created_at',
  })
  createdAt!: string;

  @Property()
  @IsOptional()
  @ApiProperty({
    name: 'deleted_at',
    type: String,
    description: 'Date and time of deletion in UTC (ISO 8601)',
    nullable: false,
  })
  @IsDateString()
  @IsNotEmpty()
  @Expose({
    name: 'deleted_at',
  })
  deletedAt?: string;
}

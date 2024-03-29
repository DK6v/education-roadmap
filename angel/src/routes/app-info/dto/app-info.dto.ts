import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

import * as fs from 'fs';

export class AppInfoDto {
  @Exclude()
  private package: object;

  constructor() {
    this.package = JSON.parse(
      fs.readFileSync(process.env.npm_package_json, 'utf-8'),
    );
  }

  @ApiProperty({
    type: String,
    description: 'Application name',
    nullable: true,
  })
  @IsString()
  @MaxLength(100)
  @Expose({
    name: 'name',
  })
  get name(): string {
    return process.env.npm_package_name ?? undefined;
  }

  @ApiProperty({
    type: String,
    description: 'Application version',
    nullable: true,
  })
  @IsString()
  @MaxLength(100)
  @Expose({
    name: 'version',
  })
  get version(): string {
    return process.env.npm_package_version ?? undefined;
  }

  @ApiProperty({
    type: String,
    description: 'Application author',
    nullable: true,
  })
  @IsString()
  @MaxLength(100)
  @Expose({
    name: 'author',
  })
  get author(): string {
    return this.package['author'] ?? undefined;
  }

  @ApiProperty({
    type: String,
    description: 'Description',
    nullable: true,
  })
  @IsString()
  @MaxLength(255)
  @Expose({
    name: 'description',
  })
  get description(): string {
    return this.package['description'] ?? undefined;
  }

  @ApiProperty({
    type: String,
    description: 'Test',
    nullable: true,
  })
  @IsString()
  @MaxLength(255)
  @Expose({
    name: 'test',
  })
  test: string;
}

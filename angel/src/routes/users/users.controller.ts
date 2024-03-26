import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Query, ParseIntPipe, ParseBoolPipe, ParseEnumPipe, DefaultValuePipe } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { getProperties } from '@decorators/property.decorator';
import { GreaterOrEqualValidationPipe } from '@validation/number.validation';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  // Sample value:
  // {"email": "user_1@example.com", "first_name": "first_name_1", "last_name": "last_name_2"}
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {

    let user = await this.usersService.findByEmail(createUserDto.email);
    if (user != null) {
      throw new HttpException('Email alredy registered', HttpStatus.CONFLICT);
    }

    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiQuery({ name: 'sort', type: String, enum: getProperties(User), required: false })
  @ApiQuery({ name: 'order', type: String, enum: [ "ASC", "DESC" ], required: false })
  @ApiQuery({ name: 'offset', type: String, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'show_deleted', type: Boolean, required: false })
  async findAll(@Query('sort',
                  new DefaultValuePipe('id'),
                  new ParseEnumPipe(getProperties(User)))
                sort: string,

                @Query('order',
                  new DefaultValuePipe(UsersService.SortOrder.ASC),
                  new ParseEnumPipe(UsersService.SortOrder))
                order: UsersService.SortOrder,

                @Query('offset',
                  new DefaultValuePipe(0),
                  new GreaterOrEqualValidationPipe(0),
                  new ParseIntPipe())
                offset: number,

                @Query('limit',
                  new DefaultValuePipe(0),
                  new GreaterOrEqualValidationPipe(0),
                  new ParseIntPipe())
                limit: number,

                @Query('show_deleted',
                  new DefaultValuePipe(false),
                  new ParseBoolPipe())
                withDeleted: boolean) {

    return this.usersService.findAll(sort, order, offset, limit, withDeleted);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {

    let user = await this.usersService.findById(+id);

    if (user === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

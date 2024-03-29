import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
  ParseEnumPipe,
  DefaultValuePipe,
  HttpStatus,
  ConflictException,
  NotFoundException,
  UsePipes,
} from '@nestjs/common';
import { ApiResponse, ApiQuery } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { getProperties } from '@decorators/property.decorator';
import { GreaterOrEqualValidationPipe } from '@validation/number.validation';
import { PlainToClassPipe } from '@validation/body.validation';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'OK' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict' })
  @UsePipes(new PlainToClassPipe(CreateUserDto))
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.findByEmail(createUserDto.email);
    if (user != null) {
      throw new ConflictException('Email already registered');
    }

    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiQuery({
    name: 'sort',
    type: String,
    enum: getProperties(User),
    required: false,
  })
  @ApiQuery({
    name: 'order',
    type: String,
    enum: ['ASC', 'DESC'],
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'show_deleted',
    type: Boolean,
    required: false,
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'OK' })
  async findAll(
    @Query(
      'sort',
      new DefaultValuePipe('id'),
      new ParseEnumPipe(getProperties(User)),
    )
    sort: string,

    @Query(
      'order',
      new DefaultValuePipe(UsersService.SortOrder.ASC),
      new ParseEnumPipe(UsersService.SortOrder),
    )
    order: typeof UsersService.SortOrder,

    @Query(
      'offset',
      new DefaultValuePipe(0),
      new GreaterOrEqualValidationPipe(0),
      new ParseIntPipe(),
    )
    offset: number,

    @Query(
      'limit',
      new DefaultValuePipe(0),
      new GreaterOrEqualValidationPipe(0),
      new ParseIntPipe(),
    )
    limit: number,

    @Query('show_deleted', new DefaultValuePipe(false), new ParseBoolPipe())
    withDeleted: boolean,
  ) {
    return this.usersService.findAll(sort, order, offset, limit, withDeleted);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'OK' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  async findById(@Param('id', new ParseIntPipe()) id: number) {
    const user = await this.usersService.findById(+id);
    if (user == null) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'OK' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @UsePipes(new PlainToClassPipe(CreateUserDto))
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findById(+id, false);
    if (user == null) {
      throw new NotFoundException('User not found');
    }

    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto ';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {

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

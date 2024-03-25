import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto ';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {

    let user = this.usersRepository.create();

    user.email = createUserDto.email;
    user.first_name = createUserDto.first_name;
    user.last_name = createUserDto.last_name;
    user.created_at = (new Date()).toISOString();
    user.deleted_at = "";

    this.usersRepository.save(user);

    return new UserDto(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id: id});
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email: email});
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}

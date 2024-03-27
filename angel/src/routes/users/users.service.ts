import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto ';

import { getProperties } from 'decorators/property.decorator';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

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

  async findAll(sort: string,
                order: UsersService.SortOrder,
                offset: number = 0,
                limit: number = 0,
                withDeleted: boolean = false): Promise<User[]> {

    let query = {};

    if (!getProperties(User).includes(sort)) {
      return [];
    }

    query['order'] = {};
    query['order'][sort] = order;
    query['withDeleted'] = withDeleted;

    if (offset > 0) { query['skip'] = offset; }
    if (limit > 0) { query['take'] = limit; }

    return await this.usersRepository.find(query);
  }

  async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id: id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email: email });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    updateUserDto['id'] = id;
    this.usersRepository.save(updateUserDto);

    return await this.findById(id);
  }
}

export namespace UsersService {
  export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC'
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { getProperties } from 'decorators/property.decorator';
import { UserDto } from './dto/user.dto ';

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  static readonly SortOrder = SortOrder;

  async create(createUserDto: CreateUserDto) {
    const user: User = this.usersRepository.create();
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    console.debug(`Create: ${JSON.stringify(user)}`);

    return new UserDto(await this.usersRepository.save(user));
  }

  async findAll(
    sort: string,
    order: typeof SortOrder,
    offset: number = 0,
    limit: number = 0,
    withDeleted: boolean = false,
  ): Promise<UserDto[]> {
    const query = {
      order: {},
      withDeleted: withDeleted,
    };

    if (!getProperties(User).includes(sort)) {
      return [];
    }

    query['order'][sort] = order;

    if (offset > 0) {
      query['skip'] = offset;
    }

    if (limit > 0) {
      query['take'] = limit;
    }

    console.log(typeof order);

    return (await this.usersRepository.find(query)).map(
      (user) => new UserDto(user),
    );
  }

  async findById(id: number): Promise<UserDto | null> {
    const user = await this.usersRepository.findOneBy({ id: id });
    return user ? new UserDto(user) : null;
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findOneBy({ email: email });
    return user ? new UserDto(user) : null;
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

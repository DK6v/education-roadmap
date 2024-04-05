import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getProperties } from '@/decorators/property.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
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

    return (await this.usersRepository.find(query)).map(
      (user) => new UserDto(user),
    );
  }

  async findById(
    id: number,
    withDeleted: boolean = true,
  ): Promise<UserDto | null> {
    const users: User[] = await this.usersRepository.find({
      where: { id: id },
      take: 1,
      withDeleted: withDeleted,
    });
    return users.length ? new UserDto(users[0]) : null;
  }

  async findByEmail(
    email: string,
    withDeleted: boolean = true,
  ): Promise<UserDto | null> {
    const users: User[] = await this.usersRepository.find({
      where: { email: email },
      take: 1,
      withDeleted: withDeleted,
    });
    return users.length ? new UserDto(users[0]) : null;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    updateUserDto['id'] = id;
    await this.usersRepository.save(updateUserDto);
    return new UserDto((await this.findById(id)) as User);
  }
}

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

  // {"email": "user_1@example.com", "first_name": "first_name_1", "last_name": "last_name_2"}
  async create(createUserDto: CreateUserDto) {

    let userExist = await this.usersRepository.find({
      select: {
        id: true
      },
      where: {
        email: createUserDto.email
      }})
      .then((results: User[]) => { return results.length != 0; });

    if (userExist == true) {
      throw new HttpException('Email alredy registered', HttpStatus.CONFLICT);
    }

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

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}

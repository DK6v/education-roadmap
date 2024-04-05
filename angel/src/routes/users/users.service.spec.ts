import { TestBed } from '@automock/jest';

import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let database: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersService).compile();

    service = unit;
    database = unitRef.get(getRepositoryToken(User) as string);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(database).toBeDefined();
  });

  it('create user mocked', async () => {
    const userData = {
      email: 'user@example.com',
      firstName: 'firstName',
      lastName: 'lastName',
    };

    database.create.mockImplementation(() => {
      return new User();
    });

    database.save.mockImplementation((entity) => {
      return Promise.resolve({
        ...{ id: 1 },
        ...entity,
      } as User);
    });

    const response: UserDto = await service.create(userData as CreateUserDto);

    expect(database.create).toHaveBeenCalled();
    expect(database.save).toHaveBeenCalled();

    expect(response).toBeDefined();
    expect(response).toEqual({
      ...{ id: 1 },
      ...userData,
    } as UserDto);
  });
});

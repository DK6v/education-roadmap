import { TestBed } from '@automock/jest';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { getProperties } from '@/decorators/property.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersController).compile();

    controller = unit;
    service = unitRef.get(UsersService);
  });

  it('should be defined', async () => {
    const userData = {
      email: 'user@example.com',
      firstName: 'firstName',
      lastName: 'lastName',
    };

    service.create.mockImplementation((createUserDto: CreateUserDto) => {
      const user = new UserDto(null);
      getProperties(UserDto).forEach((key) => {
        user[key] = createUserDto[key] ?? undefined;
      });
      return Promise.resolve(user);
    });

    expect(controller).toBeDefined();
    expect(service).toBeDefined();

    const response: UserDto = await controller.create(
      Object.assign(userData, { id: 1 }) as CreateUserDto,
    );

    console.log('Response: ' + JSON.stringify(response));

    expect(service.create).toHaveBeenCalled();
    expect(response).toEqual(Object.assign(userData, { id: 1 }) as UserDto);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import {
  ClassSerializerInterceptor,
  ValidationPipe,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { AppModule } from '@/app.module';
import { UserDto } from '@/routes/users/dto/user.dto';
import { User } from '@/routes/users/entities/user.entity';

describe('AppController (e2e), plain', () => {
  let app: INestApplication;
  let db: Repository<User>;

  const users = [
    {
      id: 1,
      email: 'user1@example.com',
      first_name: 'first_name_1',
      last_name: 'last_name_1',
      created_at: new Date().toISOString(),
      deleted_at: undefined,
    },
    {
      id: 2,
      email: 'user2@example.com',
      first_name: 'first_name_2',
      last_name: 'last_name_2',
      created_at: new Date().toISOString(),
      deleted_at: undefined,
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    db = moduleFixture.get(getRepositoryToken(User) as string);

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), {}),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  it('/users (GET)', async () => {
    jest
      .spyOn(db, 'find')
      .mockReturnValue(
        Promise.resolve(
          users.map((user) => plainToClass(UserDto, user) as User),
        ),
      );
    expect(jest.isMockFunction(db.find)).toBeTruthy();

    const response = await request(app.getHttpServer())
      .get('/users')
      .send()
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(users);
  });

  it('/users (POST)', async () => {
    const user = users[0];
    const body = Object.keys(user).reduce((result, key) => {
      if (['email', 'first_name', 'last_name'].includes(key)) {
        result[key] = user[key];
      }
      return result;
    }, {});

    const spyDbFind = jest
      .spyOn(db, 'find')
      .mockReturnValueOnce(Promise.resolve(null));

    const spyDbCreate = jest
      .spyOn(db, 'create')
      .mockReturnValueOnce(new User());

    const spyDbSave = jest
      .spyOn(db, 'save')
      .mockReturnValue(Promise.resolve(plainToClass(UserDto, user) as User));

    await request(app.getHttpServer())
      .post('/users')
      .send(body)
      .expect(HttpStatus.CREATED);

    expect(spyDbFind).toHaveBeenCalledTimes(1);
    expect(spyDbFind).toHaveBeenCalledWith({
      where: { email: user.email },
      take: 1,
      withDeleted: true,
    });

    expect(spyDbCreate).toHaveBeenCalledTimes(1);
    expect(spyDbSave).toHaveBeenCalledTimes(1);
  });
});

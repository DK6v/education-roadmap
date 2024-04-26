import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import * as fs from 'fs';

import { AppModule } from '@/app.module';
import { UserDto } from '@/routes/users/dto/user.dto';
import { User } from '@/routes/users/entities/user.entity';

describe('AppController (e2e), serialized', () => {
  let app: INestApplication;
  let db: Repository<User>;

  const users: User[] = [
    {
      id: 1,
      email: 'user1@example.com',
      firstName: 'first_name_1',
      lastName: 'last_name_1',
      createdAt: new Date().toISOString(),
      deletedAt: undefined,
    },
    {
      id: 2,
      email: 'user2@example.com',
      firstName: 'first_name_2',
      lastName: 'last_name_2',
      createdAt: new Date().toISOString(),
      deletedAt: undefined,
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    db = moduleFixture.get(getRepositoryToken(User) as string);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .send()
      .expect(HttpStatus.MOVED_PERMANENTLY)
      .expect('location', '/api');
  });

  it('/application/info (GET)', () => {
    const packageInfo = {
      author: 'test_controller',
      description: 'test_description',
    };

    const response = Object.assign({
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
      ...packageInfo,
    });

    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(packageInfo));
    expect(jest.isMockFunction(fs.readFileSync)).toBeTruthy();

    return request(app.getHttpServer())
      .get('/application/info')
      .expect(HttpStatus.OK)
      .expect(response);
  });

  it('/users (GET)', async () => {
    jest.spyOn(db, 'find').mockReturnValue(Promise.resolve(users));
    expect(jest.isMockFunction(db.find)).toBeTruthy();

    const response = await request(app.getHttpServer())
      .get('/users')
      .send()
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(users as UserDto[]);
  });

  it('/users (POST)', async () => {
    const user: User = users[0];
    const body = Object.keys(user).reduce((result, key) => {
      if (['email', 'firstName', 'lastName'].includes(key)) {
        result[key] = user[key];
      }
      return result;
    }, {});

    const spyDbFind = jest
      .spyOn(db, 'find')
      .mockReturnValueOnce(Promise.resolve([]));

    const spyDbCreate = jest
      .spyOn(db, 'create')
      .mockReturnValueOnce(new User());

    const spyDbSave = jest
      .spyOn(db, 'save')
      .mockReturnValue(Promise.resolve(user));

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

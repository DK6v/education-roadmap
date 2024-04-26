import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import {
  ClassSerializerInterceptor,
  ValidationPipe,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { AppModule } from '@/app.module';
import { UserDto } from '@/routes/users/dto/user.dto';
import { User } from '@/routes/users/entities/user.entity';

jest.mock('@/config/data-source.config', () => ({
  ...jest.requireActual('@/config/data-source.config'),
  getConfig: jest.fn((_config: ConfigService) => {
    console.log('Mock function @/config/data-source.config:getConfig()');
    return {
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [User],
      synchronize: true,
      logging: false,
    };
  }),
}));

describe('AppController (e2e), SQLite In-Memory database', () => {
  let app: INestApplication;
  let db: Repository<User>;

  const users = [
    {
      id: 1,
      email: 'user1@example.com',
      first_name: 'first_name_1',
      last_name: 'last_name_1',
    },
    {
      id: 2,
      email: 'user2@example.com',
      first_name: 'first_name_2',
      last_name: 'last_name_2',
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();

    db = moduleFixture.get(getRepositoryToken(User) as string);
    const entries: User[] = db.create(
      users.map((user) => plainToClass(UserDto, user) as User),
    );
    console.log(JSON.stringify(entries));
    await db.save(entries);

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
    const response = await request(app.getHttpServer())
      .get('/users')
      .send()
      .expect(HttpStatus.OK);
    console.log(JSON.stringify(response));

    expect(response.body).toEqual(
      users.map((user) => {
        return {
          ...user,
          created_at: expect.any(String),
        };
      }),
    );
  });

  it('/users/{id} (GET)', async () => {
    let response: any;

    response = await request(app.getHttpServer())
      .get('/users/1')
      .send()
      .expect(HttpStatus.OK);
    console.log(JSON.stringify(response));
    expect(response.body).toEqual({
      ...users[0],
      created_at: expect.any(String),
    });

    response = await request(app.getHttpServer())
      .get('/users/2')
      .send()
      .expect(HttpStatus.OK);
    console.log(JSON.stringify(response));
    expect(response.body).toEqual({
      ...users[1],
      created_at: expect.any(String),
    });

    response = await request(app.getHttpServer())
      .get('/users/3')
      .send()
      .expect(HttpStatus.NOT_FOUND);
    console.log(JSON.stringify(response));
  });

  it('/users (POST)', async () => {
    const user = {
      email: 'user3@example.com',
      first_name: 'first_name_3',
      last_name: 'last_name_3',
    };

    const createResp = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(HttpStatus.CREATED);
    console.log(JSON.stringify(createResp));

    const getResp = await request(app.getHttpServer())
      .get(`/users/${createResp.body.id}`)
      .send()
      .expect(HttpStatus.OK);
    console.log(JSON.stringify(getResp));
    expect(getResp.body).toEqual({
      ...user,
      id: createResp.body.id,
      created_at: expect.any(String),
    });
  });

  it('/users (DELETE)', async () => {
    const userIx = 0;
    const deleteResp = await request(app.getHttpServer())
      .delete(`/users/${users[userIx].id}`)
      .expect(HttpStatus.OK);
    console.log(JSON.stringify(deleteResp));

    const getResp = await request(app.getHttpServer())
      .get(`/users/${users[userIx].id}`)
      .send()
      .expect(HttpStatus.OK);
    console.log(JSON.stringify(getResp));
    expect(getResp.body).toEqual({
      ...users[userIx],
      id: users[userIx].id,
      created_at: expect.any(String),
      deleted_at: expect.any(String),
    });
  });
});

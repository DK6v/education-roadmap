import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as fs from 'fs';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/application/info')
      .expect(301);
  });

  it('/applicaion/info (GET)', () => {

    let pack = JSON.parse(fs.readFileSync(process.env.npm_package_json, 'utf-8'));

    let resp = {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
      author: pack["author"] ?? undefined,
      description: pack["description"] ?? undefined,
      _not_exist_: pack["_not_exist_"] ?? undefined
    };

    // Remove undefined properties
    Object.keys(resp).forEach(key => resp[key] === undefined && delete resp[key])

    return request(app.getHttpServer())
      .get('/application/info')
      .expect(200)
      .expect(resp);
  });
});

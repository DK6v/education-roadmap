import { Test, TestingModule } from '@nestjs/testing';
import { AppInfoService } from './app-info.service';
import { AppInfoDto } from './dto/app-info.dto';

import * as fs from 'fs';
jest.mock('fs');

describe('AppInfoService', () => {
  let service: AppInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppInfoService],
    }).compile();

    service = module.get<AppInfoService>(AppInfoService);
  });

  it('get application info (manual mocks)', () => {
    const packageInfo = {
      author: 'test_mocks_author',
      description: 'test_mocks_description',
    };

    expect(jest.isMockFunction(fs.readFileSync)).toBeTruthy(); // manual mocks
    expect(jest.isMockFunction(fs.writeFile)).toBeFalsy(); // other

    expect(service).toBeDefined();
    const response: AppInfoDto = service.getInfo();
    console.log('Response: ' + JSON.stringify(response));

    expect(fs.readFileSync).toHaveBeenCalled();
    expect(response).toEqual({ package: packageInfo });
    expect(response.name).toEqual(process.env.npm_package_name);
    expect(response.version).toEqual(process.env.npm_package_version);
    expect(response.author).toEqual(packageInfo.author);
    expect(response.description).toEqual(packageInfo.description);
  });
});

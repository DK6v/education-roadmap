import { Test, TestingModule } from '@nestjs/testing';
import { AppInfoController } from './app-info.controller';
import { AppInfoService } from './app-info.service';
import { AppInfoDto } from './dto/app-info.dto';

import * as fs from 'fs';

describe('AppInfoController', () => {
  let controller: AppInfoController;
  let service: AppInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppInfoController],
      providers: [AppInfoService],
    }).compile();

    controller = module.get<AppInfoController>(AppInfoController);
    service = module.get<AppInfoController>(AppInfoService);
  });

  it('get application info (mock service)', async () => {
    jest.spyOn(service, 'getInfo').mockImplementation(() => {
      return { name: 'test' } as AppInfoDto;
    });

    expect(controller).toBeDefined();
    const response = await controller.getInfo();
    console.log('Response: ' + JSON.stringify(response));

    expect(service.getInfo).toHaveBeenCalled();
    expect(response.name).toEqual('test');
  });

  it('get application info (mock fs module)', async () => {
    const packageInfo = {
      author: 'test_controller',
      description: 'description',
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(packageInfo));
    expect(jest.isMockFunction(fs.readFileSync)).toBeTruthy();
    expect(jest.isMockFunction(fs.writeFile)).toBeFalsy(); // other

    expect(controller).toBeDefined();
    const response: AppInfoDto = await controller.getInfo();
    console.log('Response: ' + JSON.stringify(response));

    expect(fs.readFileSync).toHaveBeenCalled();
    expect(response).toEqual({ package: packageInfo });
    expect(response.name).toEqual(process.env.npm_package_name);
    expect(response.version).toEqual(process.env.npm_package_version);
    expect(response.author).toEqual(packageInfo.author);
    expect(response.description).toEqual(packageInfo.description);
  });
});

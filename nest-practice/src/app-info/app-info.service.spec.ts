import { Test, TestingModule } from '@nestjs/testing';
import { AppInfoService } from './app-info.service';

describe('AppInfoService', () => {
  let service: AppInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppInfoService],
    }).compile();

    service = module.get<AppInfoService>(AppInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

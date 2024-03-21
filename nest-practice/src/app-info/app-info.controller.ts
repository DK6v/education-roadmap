import {
  UseInterceptors,
  ClassSerializerInterceptor,
  Controller,
  Get
} from '@nestjs/common';

import { AppInfoService } from './app-info.service';

@Controller('/application/info')
@UseInterceptors(ClassSerializerInterceptor)
export class AppInfoController {
  constructor(private readonly appInfoService: AppInfoService) { }

  @Get()
  getInfo() {
    return this.appInfoService.getInfo();
  }
}

import {
  UseInterceptors,
  ClassSerializerInterceptor,
  Controller,
  Get,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AppInfoService } from './app-info.service';

@Controller('/application/info')
@UseInterceptors(ClassSerializerInterceptor)
export class AppInfoController {
  constructor(private readonly appInfoService: AppInfoService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'OK' })
  getInfo() {
    return this.appInfoService.getInfo();
  }
}

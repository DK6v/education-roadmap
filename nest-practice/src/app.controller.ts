import {
  UseInterceptors,
  ClassSerializerInterceptor,
  Controller,
  Get
} from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/application/info')
  getInfo() {
    return this.appService.getInfo();
  }
}

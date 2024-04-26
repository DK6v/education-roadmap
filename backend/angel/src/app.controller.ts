import { Controller, Get, Redirect, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Redirect('/api', HttpStatus.MOVED_PERMANENTLY)
  redirect() {}
}

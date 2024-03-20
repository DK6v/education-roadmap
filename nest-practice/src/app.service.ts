import { Injectable } from '@nestjs/common';
import { AppInfoDto } from './dto/app-info.dto';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  getInfo(): AppInfoDto {
    return new AppInfoDto()
  }
}

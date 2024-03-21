import { Injectable } from '@nestjs/common';
import { AppInfoDto } from './dto/app-info.dto';

@Injectable()
export class AppInfoService {
	getInfo(): AppInfoDto {
		return new AppInfoDto()
	}
}

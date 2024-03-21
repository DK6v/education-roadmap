import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppInfoModule } from './app-info/app-info.module';

@Module({
  imports: [AppInfoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

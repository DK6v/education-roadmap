import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppInfoModule } from '@routes/app-info/app-info.module';
import { UsersModule } from '@routes/users/users.module';
import { User } from '@routes/users/entities/user.entity';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forRoot({
              type: ((): any => process.env.DB_TYPE)(),
              host: process.env.DB_HOST,
              port: Number(process.env.DB_PORT),
              database: process.env.DB_NAME,
              username: process.env.DB_USERNAME,
              password: process.env.DB_PASSWORD,
              entities: [User],
              synchronize: true,
              autoLoadEntities: true
            }),
            AppInfoModule,
            UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

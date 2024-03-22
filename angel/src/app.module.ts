import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppInfoModule } from './app-info/app-info.module';
import { UsersModule } from './users/users.module';

import { User } from './users/entities/user.entity';

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

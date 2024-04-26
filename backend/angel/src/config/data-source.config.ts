import { ConfigService } from '@nestjs/config';
import { User } from '@/routes/users/entities/user.entity';

export function getConfig(_config: ConfigService) {
  return {
    type: ((): any => process.env.DB_TYPE)(),
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [User],
    synchronize: true,
    autoLoadEntities: true,
  };
}

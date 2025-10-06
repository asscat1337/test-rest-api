import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';
import { Users } from './models/user.model';
import { Posts } from './models/posts.model';
import { isDev } from 'src/utils/helpers';

export const getDatabaseConfig = (
  config: ConfigService,
): TypeOrmModuleOptions & PostgresConnectionCredentialsOptions => ({
  type: 'postgres',
  host: isDev(process.env.NODE_ENV) ? 'localhost' : config.get('POSTGRES_HOST'),
  port: 5432,
  username: config.get('POSTGRES_USER'),
  password: config.get('POSTGRES_PASSWORD'),
  entities: [Users, Posts],
  synchronize: process.env.NODE_ENV === 'development',
});

export const getDataSource = new DataSource({
  type: 'postgres',
  host: isDev(process.env.NODE_ENV) ? 'localhost' : process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  synchronize: process.env.NODE_ENV === 'development',
  entities: [Users, Posts],
});

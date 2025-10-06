import { DataSource } from 'typeorm';
import { Posts } from './models/posts.model';
import { Users } from './models/user.model';
import * as dotenv from 'dotenv';
import { isDev } from '../utils/helpers';
import migrations from './migrations';

dotenv.config();
export const getDataSource = new DataSource({
  type: 'postgres',
  host: isDev(process.env.NODE_ENV) ? 'localhost' : process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  synchronize: isDev(process.env.NODE_ENV),
  entities: [Users, Posts],
  migrations: migrations,
  migrationsRun: process.env.DB_MIGRATION_RUN === 'true',
});

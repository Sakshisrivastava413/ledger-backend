import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Account } from './src/account/account.entity';
import { Entry } from './src/entry/entry.entity';
import { Transaction } from './src/transaction/transaction.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'ledger_user',
  password: process.env.DB_PASS || 'password123',
  database: process.env.DB_NAME || 'ledger',
  entities: [Account, Entry, Transaction],
  synchronize: true,
};

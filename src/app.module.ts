import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { EntryModule } from './entry/entry.module';
import { TransactionModule } from './transaction/transaction.module';
import { databaseConfig } from '../database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AccountModule,
    EntryModule,
    TransactionModule,
  ],
})
export class AppModule {}

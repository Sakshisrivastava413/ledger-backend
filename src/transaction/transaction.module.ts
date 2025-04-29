import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Entry } from '../entry/entry.entity';
import { Account } from '../account/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Entry, Account]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}

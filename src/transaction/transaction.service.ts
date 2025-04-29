import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Entry } from '../entry/entry.entity';
import { Account } from '../account/account.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Entry)
    private readonly entryRepository: Repository<Entry>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    private readonly dataSource: DataSource,
  ) {}

  async createTransaction(data: {
    description: string;
    date: string;
    entries: { accountId: number; amount: number }[];
  }): Promise<Transaction> {
    if (!data.entries || data.entries.length < 2) {
      throw new BadRequestException({
        message: 'Transaction must have at least two entries',
        statusCode: 400,
      });
    }

    const total = data.entries.reduce((sum, e) => {
      return Math.round((sum + Number(e.amount)) * 100) / 100;
    }, 0);

    if (total !== 0) {
      throw new BadRequestException({
        message: 'Transaction is not balanced (Debits != Credits)',
        statusCode: 400,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = this.transactionRepository.create({
        description: data.description,
        date: new Date(data.date),
      });
      await queryRunner.manager.save(transaction);
      for (const entryData of data.entries) {
        const account = await queryRunner.manager.findOne(Account, {
          where: { id: entryData.accountId },
        });
        if (!account) {
          throw new InternalServerErrorException(
            `Account with id ${entryData.accountId} not found`,
          );
        }

        const amount = parseFloat(entryData.amount.toFixed(2));
        if (isNaN(amount)) {
          throw new BadRequestException(
            `Invalid amount for account id ${entryData.accountId}`,
          );
        }
        if (amount < 0 && account.balance < Math.abs(amount)) {
          throw new BadRequestException({
            message: `Insufficient balance in account ${account.id}`,
            statusCode: 400,
          });
        }
        let balance = account.balance
          ? parseFloat(account.balance.toString())
          : 0;

        account.balance = parseFloat((balance + amount).toFixed(2));

        await queryRunner.manager.save(account);

        const entry = this.entryRepository.create({
          amount,
          transaction,
          account,
        });
        await queryRunner.manager.save(entry);
      }

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          message: 'Failed to create transaction',
          statusCode: 500,
        });
      }
    } finally {
      await queryRunner.release();
    }
  }

  async getAllTransactions(
    accountId?: number,
    startDate?: string,
    endDate?: string,
  ) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.entries', 'entry')
      .leftJoinAndSelect('entry.account', 'account')
      .orderBy('transaction.date', 'DESC');

    if (accountId) {
      query.andWhere('account.id = :accountId', { accountId });
    }
    if (startDate) {
      query.andWhere('transaction.date >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('transaction.date <= :endDate', { endDate });
    }

    return query.getMany();
  }
}

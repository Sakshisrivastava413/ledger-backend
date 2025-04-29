import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>
  ) {}

  async getBalance(id: number): Promise<{ balance: number }> {
    const account = await this.accountRepository.findOne({ where: { id } });

    if (!account) {
      throw new Error('Account not found');
    }

    return { balance: account.balance };
  }
}

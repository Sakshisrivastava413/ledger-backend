import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { Account } from '../account/account.entity';

@Entity()
export class Entry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.entries)
  @JoinColumn()
  transaction: Transaction;

  @ManyToOne(() => Account, (account) => account.entries)
  @JoinColumn()
  account: Account;

  @Column('numeric', { precision: 10, scale: 2 })
  amount: number;
}

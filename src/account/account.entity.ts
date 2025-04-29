import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Entry } from '../entry/entry.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Entry, (entry) => entry.account)
  entries: Entry[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;
}

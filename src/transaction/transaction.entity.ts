import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Entry } from '../entry/entry.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  date: Date;

  @OneToMany(() => Entry, (entry) => entry.transaction)
  entries: Entry[];
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"

// https://orkhan.gitbook.io/typeorm/docs/many-to-one-one-to-many-relations

@Entity()
export class Account {

  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[]
}

@Entity()
export class Transaction {

  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  data: string

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account
}

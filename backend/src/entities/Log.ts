import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  level!: string;

  @Column('text')
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ unique: true })
  ticketNumber!: string;

  @Column()
  organization!: string;

  @Column({ default: 'open' })
  status!: string;

  @Column({ type: 'datetime' })
  createdDate!: Date;

  @Column({ type: "datetime", nullable: true })
  expirationDate?: Date | null;

  @Column({ nullable: true })
  location!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string;

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;
}

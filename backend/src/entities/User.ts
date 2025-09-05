import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Role } from './Role';
import { Ticket } from './Ticket';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @ManyToOne(() => Role, (r) => r.users, { eager: true })
  role!: Role;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.createdBy)
  tickets!: Ticket[];
}

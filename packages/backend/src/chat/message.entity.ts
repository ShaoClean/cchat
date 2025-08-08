import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    uuid: number;

    @Column({ nullable: false })
    content: string;

    @Column({ default: 0 })
    status: number;

    @CreateDateColumn()
    created_time: Date;

    @CreateDateColumn()
    update_time: Date;
}

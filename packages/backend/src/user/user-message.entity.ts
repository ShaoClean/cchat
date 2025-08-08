import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class UserMessageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ nullable: false })
    user_uuid: string;

    @Column({ nullable: false })
    message_uuid: string;

    @CreateDateColumn()
    created_time: Date;

    @CreateDateColumn()
    update_time: Date;
}

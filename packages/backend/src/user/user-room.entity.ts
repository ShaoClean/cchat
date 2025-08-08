import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class UserRoomEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ nullable: false })
    user_uuid: string;

    @Column({ nullable: false })
    room_uuid: string;

    @Column({ default: 0 })
    is_online: number;

    @Column({ default: 0 })
    permission: number;

    @Column()
    title: string;

    @CreateDateColumn()
    created_time: Date;

    @CreateDateColumn()
    update_time: Date;
}

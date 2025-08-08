import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class RoomEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    room_name: string;

    @Column({ nullable: true })
    password: string;

    @Column()
    number: number;

    @Column({ default: 0 })
    is_lock: number;

    @Column({ nullable: true })
    avatar: string;

    @Column({ default: 0 })
    level: number;

    @Column({ default: 0 })
    status: number;

    @CreateDateColumn()
    created_time: Date;

    @UpdateDateColumn()
    updated_time: Date;
}

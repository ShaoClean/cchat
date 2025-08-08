import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class RoomMessageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ nullable: false })
    room_uuid: string;

    @Column({ nullable: false })
    message_uuid: string;

    @CreateDateColumn()
    created_time: Date;

    @CreateDateColumn()
    update_time: Date;
}

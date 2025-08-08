import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    number: number;

    @Column({ nullable: true })
    avatar: string;

    @Column({ default: 0 })
    level: number;

    @Column({ default: 0 })
    status: string;

    @Column({ default: 0 })
    is_online: number;

    @CreateDateColumn()
    created_time: Date;

    @UpdateDateColumn()
    updated_time: Date;
}

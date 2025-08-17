import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ThirdPartEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    /**
     * 第三方用户 id
     */
    @Column()
    correlation_id: number;

    /**
     * 第三方名字
     */
    @Column({
        default: 'github',
    })
    name: 'github' | 'google';

    /**
     * 本应用用户uuid
     */
    @Column({ unique: true })
    user_uuid: string;

    @CreateDateColumn()
    created_time: Date;

    @UpdateDateColumn()
    updated_time: Date;
}

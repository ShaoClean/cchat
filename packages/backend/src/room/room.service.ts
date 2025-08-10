import { Repository } from 'typeorm';
import { RoomEntity } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
    ) {}

    async create(roomInfo: Partial<RoomEntity>): Promise<RoomEntity> {
        const room = this.roomRepository.create(roomInfo);

        return await this.roomRepository.save(room);
    }

    async getAll(): Promise<RoomEntity[]> {
        return await this.roomRepository.find();
    }
}

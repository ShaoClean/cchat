import { Body, Controller, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomEntity } from './room.entity';

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post('create')
    async create(@Body() info: Partial<RoomEntity>) {
        return this.roomService.create(info);
    }

    @Post('get_all')
    async getAll() {
        return this.roomService.getAll();
    }
}

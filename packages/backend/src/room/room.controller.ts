import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomEntity } from './room.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post('create')
    async create(@Body() info: Partial<RoomEntity>) {
        return this.roomService.create(info);
    }

    @Post('get_all')
    async getAll() {
        return await this.roomService.getAll();
    }
}

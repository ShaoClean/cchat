import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './room.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RoomEntity])],
    controllers: [RoomController],
    providers: [RoomService],
})
export class RoomModule {}

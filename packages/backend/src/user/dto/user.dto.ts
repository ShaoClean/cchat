import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ type: String })
    uuid: string;

    @ApiProperty({ type: String })
    username: string;

    @ApiProperty({ type: String, required: false })
    number?: number;

    @ApiProperty({ type: String, required: false })
    avatar?: string;

    @ApiProperty({ type: String })
    level: number;

    @ApiProperty({ type: String })
    status: string;

    @ApiProperty({ type: Number })
    is_online: number;

    @ApiProperty({ type: Date, format: 'date-time' })
    created_time: Date;

    @ApiProperty({ type: Date, format: 'date-time' })
    updated_time: Date;
}

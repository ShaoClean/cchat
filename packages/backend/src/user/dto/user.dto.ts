import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ type: 'string' })
    uuid: string;

    @ApiProperty({ type: 'string' })
    username: string;

    @ApiProperty({ type: 'number', required: false })
    number?: number;

    @ApiProperty({ type: 'string', required: false })
    avatar?: string;

    @ApiProperty({ type: 'number' })
    level: number;

    @ApiProperty({ type: 'string' })
    status: string;

    @ApiProperty({ type: 'number' })
    is_online: number;

    @ApiProperty({ type: 'string', format: 'date-time' })
    created_time: Date;

    @ApiProperty({ type: 'string', format: 'date-time' })
    updated_time: Date;
}

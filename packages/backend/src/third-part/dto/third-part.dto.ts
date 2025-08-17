import { ApiProperty } from '@nestjs/swagger';

export class ThirdPartDTO {
    @ApiProperty({
        type: String,
    })
    uuid: string;

    @ApiProperty({
        type: Number,
    })
    correlation_id: number;

    @ApiProperty({
        type: String,
    })
    name: 'github' | 'google';

    @ApiProperty({
        type: String,
    })
    user_uuid: string;

    @ApiProperty({
        type: Number,
    })
    created_time: Date;

    @ApiProperty({
        type: Number,
    })
    updated_time: Date;
}

export class LoginDTO {
    @ApiProperty({
        type: String,
    })
    correlationId: number;
}

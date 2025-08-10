import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        type: 'string',
    })
    @IsString()
    username: string;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @IsString()
    @IsOptional()
    password: string;
}

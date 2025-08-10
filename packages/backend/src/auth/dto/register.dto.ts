import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        type: 'string',
    })
    @IsString()
    username: string;

    @ApiProperty({
        type: 'string',
    })
    password: string;
}

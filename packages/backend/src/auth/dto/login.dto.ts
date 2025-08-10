import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class LoginDto {
    // @ApiProperty({
    //     type: 'string',
    // })
    // @IsString()
    // username: string;
    //
    // @ApiProperty({
    //     type: 'number',
    // })
    // @IsNumber()
    // port: number;
    //
    // @ApiProperty({
    //     type: 'string',
    //     required: false,
    // })
    // @IsString()
    // @IsOptional()
    // username: string;
}

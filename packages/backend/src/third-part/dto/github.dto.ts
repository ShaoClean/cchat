import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class FetchGithubTokenDTO {
    @ApiProperty({
        type: String,
        required: true,
    })
    @IsString()
    code: string;
}

export class QueryGithubUserDTO {
    @ApiProperty({
        type: Number,
        required: true,
    })
    @IsNumber()
    correlationId: number;
}

export class CreateGithubUserDTO {
    @ApiProperty({
        type: Number,
        required: true,
    })
    @IsNumber()
    correlationId: number;

    @ApiProperty({
        type: String,
        required: true,
    })
    @IsString()
    user_uuid: string;
}

export class FetchGithubTokenResponseDTO {
    @ApiProperty({
        type: String,
    })
    access_token: string;
}

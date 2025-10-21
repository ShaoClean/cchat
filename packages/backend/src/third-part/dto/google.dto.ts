import { ApiProperty } from '@nestjs/swagger';

export class FetchGoogleTokenDTO {
    @ApiProperty({
        type: String,
        description: 'Authorization code from Google OAuth'
    })
    code: string;
}

export class FetchGoogleTokenResponseDTO {
    @ApiProperty({
        type: String,
    })
    access_token: string;

    @ApiProperty({
        type: String,
    })
    token_type: string;

    @ApiProperty({
        type: Number,
    })
    expires_in: number;

    @ApiProperty({
        type: String,
        required: false,
    })
    refresh_token?: string;

    @ApiProperty({
        type: String,
        required: false,
    })
    scope?: string;
}

export class QueryGoogleUserDTO {
    @ApiProperty({
        type: Number,
        description: 'Google user ID'
    })
    correlationId: number;
}

export class CreateGoogleUserDTO {
    @ApiProperty({
        type: Number,
        description: 'Google user ID'
    })
    correlationId: number;

    @ApiProperty({
        type: String,
        description: 'UUID of the user in our system'
    })
    user_uuid: string;
}

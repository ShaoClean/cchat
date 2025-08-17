import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserDto } from '../../user/dto/user.dto';

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

export class RegisterResponseDTO {
    @ApiProperty({
        type: 'string',
    })
    access_token: string;

    @ApiProperty({
        type: () => UserDto,
    })
    user: UserDto;
}

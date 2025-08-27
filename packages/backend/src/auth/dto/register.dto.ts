import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserDto } from '../../user/dto/user.dto';

export class RegisterDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    username: string;

    @ApiProperty({
        type: String,
    })
    password: string;
}

export class RegisterResponseDTO {
    @ApiProperty({
        type: String,
    })
    access_token: string;

    @ApiProperty({
        type: () => UserDto,
    })
    user: UserDto;
}

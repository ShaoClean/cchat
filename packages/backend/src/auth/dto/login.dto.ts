import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserDto } from '../../user/dto/user.dto';
export class LoginDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    username: string;

    @ApiProperty({
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    password: string;
}

export class LoginResponseDto {
    @ApiProperty({
        type: String,
    })
    access_token: string;

    @ApiProperty({
        type: () => UserDto,
    })
    user: UserDto;
}

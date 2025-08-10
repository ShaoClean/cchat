import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { User } from '../../user/user.entity';
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
// TODO User entity is not import after generate api
export interface LoginRes extends Omit<User, 'password'> {}

export class LoginResponseDto {
    access_token: string;
    user: LoginRes;
}

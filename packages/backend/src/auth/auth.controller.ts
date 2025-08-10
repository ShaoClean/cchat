import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiResponse({
        status: 200,
        type: LoginResponseDto,
    })
    async login(@Body() body: LoginDto) {
        return await this.authService.login(body);
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body.username, body.password);
    }

    @Post('validate')
    async validateToken(@Headers('authorization') authHeader: string) {
        if (!authHeader) {
            throw new Error('Authorization header missing');
        }
        const token = authHeader.replace('Bearer ', '');
        return this.authService.validateToken(token);
    }

    @Post('refresh')
    async refreshToken(@Headers('authorization') authHeader: string) {
        if (!authHeader) {
            throw new Error('Authorization header missing');
        }
        const token = authHeader.replace('Bearer ', '');
        return this.authService.refreshToken(token);
    }
}

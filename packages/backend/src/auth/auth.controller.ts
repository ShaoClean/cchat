import { Controller, Request, Post, UseGuards, Body, Get, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        console.log(req.user);
        return await this.authService.login(req.user);
    }

    @Post('register')
    async register(@Body() body: { username: string; password: string }) {
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

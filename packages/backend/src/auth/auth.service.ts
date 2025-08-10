import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && (await this.usersService.validatePassword(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: { username: string; password: string }) {
        const userData = await this.validateUser(user.username, user.password);
        if (!userData) {
            throw new UnauthorizedException();
        }
        const payload = { username: userData.username, sub: userData.uuid };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: userData.uuid,
                username: userData.username,
                avatar: userData.avatar,
            },
        };
    }

    async register(username: string, password: string) {
        const existingUser = await this.usersService.findOne(username);
        if (existingUser) {
            throw new Error('用户已存在');
        }

        const user = await this.usersService.create(username, password);
        const { password: _, ...result } = user;
        return this.login({ username: user.username, password: user.password });
    }

    async validateToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findOne(payload.username);
            if (!user) {
                throw new UnauthorizedException('用户不存在');
            }
            const { password, ...result } = user;
            return result;
        } catch (error) {
            throw new UnauthorizedException('Token无效或已过期');
        }
    }

    async refreshToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findOne(payload.username);
            if (!user) {
                throw new UnauthorizedException('用户不存在');
            }
            return this.login(user);
        } catch (error) {
            throw new UnauthorizedException('Token无效，无法刷新');
        }
    }
}

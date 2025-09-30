import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ThirdPartStrategy } from '../strategy.abstract';
import * as process from 'node:process';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ThirdPartEntity } from '../../third-part.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class GoogleStrategy implements ThirdPartStrategy {
    constructor(
        @InjectRepository(ThirdPartEntity) private readonly thirdPartRepository: Repository<ThirdPartEntity>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    support(key: string) {
        return key === 'google';
    }

    redirect(code: string) {
        if (code) {
            return { url: 'http://localhost:3000/#/login?type=google&code=' + code, statusCode: 302 };
        }
    }

    async fetchToken(code: string) {
        const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, PROXY_URL } = process.env;
        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
            throw new Error('Please check your Google OAuth environment variables!');
        }

        try {
            const params = new URLSearchParams();
            params.append('code', code);
            params.append('client_id', GOOGLE_CLIENT_ID);
            params.append('client_secret', GOOGLE_CLIENT_SECRET);
            params.append('redirect_uri', GOOGLE_REDIRECT_URI || 'http://localhost:3001/third-part/google/login_redirect');
            params.append('grant_type', 'authorization_code');
            const agent = new HttpsProxyAgent(PROXY_URL);
            const response = await axios.post('https://oauth2.googleapis.com/token', params, {
                httpsAgent: agent,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching Google token:', error);
            throw new HttpException('Failed to fetch Google token', HttpStatus.BAD_REQUEST);
        }
    }

    async queryUser(correlation_id: number) {
        return this.thirdPartRepository.findOne({
            where: {
                correlation_id,
                name: 'google' as any,
            },
        });
    }

    async createUser(correlation_id: number, user_uuid: string) {
        const user = this.thirdPartRepository.create({
            correlation_id,
            user_uuid,
            name: 'google' as any,
        });
        return this.thirdPartRepository.save(user);
    }

    async login(correlationId: number) {
        // 1. 查找Google用户关联
        const googleUser = await this.queryUser(correlationId);

        if (!googleUser) {
            throw new HttpException('Google user association not found', HttpStatus.NOT_FOUND);
        }

        // 2. 查找对应的系统用户
        let user = await this.userService.findByUuid(googleUser.user_uuid);

        if (!user) {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }

        // 3. 生成JWT token
        const payload = { username: user.username, sub: user.uuid };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }
}

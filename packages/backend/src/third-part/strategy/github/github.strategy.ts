import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ThirdPartStrategy } from '../strategy.abstract';
import * as process from 'node:process';
import { HttpsProxyAgent } from 'https-proxy-agent';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ThirdPartEntity } from '../../third-part.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GithubStrategy implements ThirdPartStrategy {
    constructor(
        @InjectRepository(ThirdPartEntity) private readonly thirdPartRepository: Repository<ThirdPartEntity>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    support(key: string) {
        return key === 'github';
    }

    async redirect(code: string) {
        if (code) {
            return { url: 'http://localhost:3000/#/login?type=github&code=' + code };
        }
    }

    async fetchToken(code: string) {
        const { PROXY_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
        if (!PROXY_URL || !GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
            throw new Error('please check your environment variable!');
        }
        const agent = new HttpsProxyAgent(PROXY_URL);

        const res = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                code,
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
            },
            {
                httpsAgent: agent,
                headers: { Accept: 'application/json' }, // GitHub 推荐加这个，不然返回 urlencoded
            },
        );

        return res.data;
    }
    async queryUser(correlation_id: number) {
        return this.thirdPartRepository.findOne({
            where: {
                correlation_id,
            },
        });
    }
    async createUser(correlation_id: number, user_uuid: string) {
        const user = this.thirdPartRepository.create({ correlation_id, user_uuid });
        return this.thirdPartRepository.save(user);
    }

    async login(correlationId: number) {
        // 1. 使用GitHub token获取用户信息
        const githubUser = await this.queryUser(correlationId);

        // 2. 查找或创建用户
        let user = await this.userService.findByUuid(githubUser.user_uuid);

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

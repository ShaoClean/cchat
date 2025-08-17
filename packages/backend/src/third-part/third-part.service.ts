import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpsProxyAgent } from 'https-proxy-agent';
import * as process from 'node:process';
import axios from 'axios';
import { Repository } from 'typeorm';
import { ThirdPartEntity } from './third-part.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ThirdPartService {
    constructor(
        @InjectRepository(ThirdPartEntity) private readonly thirdPartRepository: Repository<ThirdPartEntity>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}
    async fetchGithubToken(code: string) {
        const agent = new HttpsProxyAgent(process.env.PROXY_URL);

        const res = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                code,
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
            },
            {
                httpsAgent: agent,
                headers: { Accept: 'application/json' }, // GitHub 推荐加这个，不然返回 urlencoded
            },
        );

        return res.data;
    }

    async queryGithubUser(correlation_id: number) {
        return this.thirdPartRepository.findOne({
            where: {
                correlation_id,
            },
        });
    }

    async createGithubUser(correlation_id: number, user_uuid: string) {
        const user = this.thirdPartRepository.create({ correlation_id, user_uuid });
        return this.thirdPartRepository.save(user);
    }

    async loginWithGithub(correlationId: number) {
        // 1. 使用GitHub token获取用户信息
        const githubUser = await this.queryGithubUser(correlationId);

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

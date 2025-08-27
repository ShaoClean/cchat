import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { ThirdPartStrategy } from './strategy/strategy.abstract';
import { StrategyFromParam } from './strategy/strategy.decorator';
import { CreateGithubUserDTO, FetchGithubTokenDTO, FetchGithubTokenResponseDTO, QueryGithubUserDTO } from './dto/github.dto';
import { LoginDTO, ThirdPartDTO, ThirdPartProvider } from './dto/third-part.dto';
import { RegisterResponseDTO } from '../auth/dto/register.dto';

@Controller('third-part/:provider')
@ApiParam({
    name: 'provider',
    description: '第三方服务提供商',
    enum: ThirdPartProvider,
    enumName: 'ThirdPartProvider',
    example: 'github',
})
export class ThirdPartController {
    @Get('login_redirect')
    @Redirect('http://localhost:3000/#/login?type=github', 302)
    thirdPartLoginRedirect(@StrategyFromParam() strategy: ThirdPartStrategy, @Query('code') code: string) {
        if (code) {
            return strategy.redirect(code);
        }
    }

    @Post('fetch_token')
    @ApiResponse({
        status: 200,
        type: FetchGithubTokenResponseDTO,
    })
    async fetchToken(@StrategyFromParam() strategy: ThirdPartStrategy, @Body() body: FetchGithubTokenDTO) {
        return await strategy.fetchToken(body.code);
    }

    @Post('query_user')
    @ApiResponse({
        status: 200,
        type: ThirdPartDTO,
    })
    async queryUser(@StrategyFromParam() strategy: ThirdPartStrategy, @Body() body: QueryGithubUserDTO) {
        return await strategy.queryUser(body.correlationId);
    }

    @Post('create')
    @ApiResponse({
        status: 200,
        type: ThirdPartDTO,
    })
    async createUser(@StrategyFromParam() strategy: ThirdPartStrategy, @Body() body: CreateGithubUserDTO) {
        return await strategy.createUser(body.correlationId, body.user_uuid);
    }

    @Post('login')
    @ApiResponse({
        status: 200,
        type: RegisterResponseDTO,
    })
    async login(@StrategyFromParam() strategy: ThirdPartStrategy, @Body() body: LoginDTO) {
        return await strategy.login(body.correlationId);
    }
}

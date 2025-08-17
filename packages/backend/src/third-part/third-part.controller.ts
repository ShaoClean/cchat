import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Redirect } from '@nestjs/common';
import { ThirdPartService } from './third-part.service';
import { CreateGithubUserDTO, FetchGithubTokenDTO, FetchGithubTokenResponseDTO, QueryGithubUserDTO } from './dto/github.dto';
import { ApiResponse } from '@nestjs/swagger';
import { LoginDTO, ThirdPartDTO } from './dto/third-part.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterResponseDTO } from 'src/auth/dto/register.dto';

@Controller('third-part')
export class ThirdPartController {
    constructor(private readonly thirdPartService: ThirdPartService) {}

    @Get('github/login_redirect')
    @Redirect('http://localhost:3000/#/login?type=github', 302)
    thirdPartLoginRedirect(@Query('code') code: string) {
        if (code) {
            return { url: 'http://localhost:3000/#/login?type=github&code=' + code };
        }
    }

    @Post('github/fetch_token')
    @ApiResponse({
        status: 200,
        type: FetchGithubTokenResponseDTO,
    })
    async fetchGithubToken(@Body() body: FetchGithubTokenDTO) {
        return await this.thirdPartService.fetchGithubToken(body.code);
    }

    @Post('github/query_user')
    @ApiResponse({
        status: 200,
        type: ThirdPartDTO,
    })
    async queryUser(@Body() body: QueryGithubUserDTO) {
        return await this.thirdPartService.queryGithubUser(body.correlationId);
    }

    @Post('github/create')
    @ApiResponse({
        status: 200,
        type: ThirdPartDTO,
    })
    async createUser(@Body() body: CreateGithubUserDTO) {
        return await this.thirdPartService.createGithubUser(body.correlationId, body.user_uuid);
    }

    @Post('github/login')
    @ApiResponse({
        status: 200,
        type: RegisterResponseDTO,
    })
    async loginWithGithub(@Body() body: LoginDTO) {
        return await this.thirdPartService.loginWithGithub(body.correlationId);
    }
}

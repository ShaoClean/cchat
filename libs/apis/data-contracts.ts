export interface LoginDto {
    username: string;
    password?: string;
}

export interface UserDto {
    uuid: string;
    username: string;
    number?: string;
    avatar?: string;
    level: string;
    status: string;
    is_online: number;
    /** @format date-time */
    created_time: string;
    /** @format date-time */
    updated_time: string;
}

export interface LoginResponseDto {
    access_token: string;
    user: UserDto;
}

export interface RegisterDto {
    username: string;
    password: string;
}

export interface RegisterResponseDTO {
    access_token: string;
    user: UserDto;
}

export enum ThirdPartProvider {
    Github = 'github',
    Google = 'google',
}

export interface FetchGithubTokenDTO {
    code: string;
}

export interface FetchGithubTokenResponseDTO {
    access_token: string;
}

export interface QueryGithubUserDTO {
    correlationId: number;
}

export interface ThirdPartDTO {
    uuid: string;
    correlation_id: number;
    name: string;
    user_uuid: string;
    created_time: number;
    updated_time: number;
}

export interface CreateGithubUserDTO {
    correlationId: number;
    user_uuid: string;
}

export interface LoginDTO {
    correlationId: string;
}

export interface ThirdPartControllerThirdPartLoginRedirectParams {
    code: string;
    /** 第三方服务提供商 */
    provider: ThirdPartProvider;
}

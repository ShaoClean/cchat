export interface LoginDto {
    username: string;
    password?: string;
}

export type LoginResponseDto = object;

export interface RegisterDto {
    username: string;
    password: string;
}

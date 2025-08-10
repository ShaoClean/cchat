import { LoginDto, LoginResponseDto, RegisterDto } from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Auth<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;
    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLogin
     * @request POST:/auth/login
     */
    login = (data: LoginDto, params: RequestParams = {}) =>
        this.http.request<LoginResponseDto, any>({
            path: `/auth/login`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerRegister
     * @request POST:/auth/register
     */
    register = (data: RegisterDto, params: RequestParams = {}) =>
        this.http.request<void, any>({
            path: `/auth/register`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            ...params,
        });
    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerValidateToken
     * @request POST:/auth/validate
     */
    validateToken = (params: RequestParams = {}) =>
        this.http.request<void, any>({
            path: `/auth/validate`,
            method: 'POST',
            ...params,
        });
    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerRefreshToken
     * @request POST:/auth/refresh
     */
    refreshToken = (params: RequestParams = {}) =>
        this.http.request<void, any>({
            path: `/auth/refresh`,
            method: 'POST',
            ...params,
        });
}
const client = new HttpClient({ baseURL: `http://localhost:3001/` });
export default new Auth(client);

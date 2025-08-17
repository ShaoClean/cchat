import {
    CreateGithubUserDTO,
    FetchGithubTokenDTO,
    FetchGithubTokenResponseDTO,
    LoginDTO,
    QueryGithubUserDTO,
    RegisterResponseDTO,
    ThirdPartControllerThirdPartLoginRedirectParams,
    ThirdPartDTO,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class ThirdPart<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;
    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * No description
     *
     * @tags ThirdPart
     * @name ThirdPartControllerThirdPartLoginRedirect
     * @request GET:/third-part/github/login_redirect
     */
    thirdPartLoginRedirect = (query: ThirdPartControllerThirdPartLoginRedirectParams, params: RequestParams = {}) =>
        this.http.request<void, any>({
            path: `/third-part/github/login_redirect`,
            method: 'GET',
            query: query,
            ...params,
        });
    /**
     * No description
     *
     * @tags ThirdPart
     * @name ThirdPartControllerFetchGithubToken
     * @request POST:/third-part/github/fetch_token
     */
    fetchGithubToken = (data: FetchGithubTokenDTO, params: RequestParams = {}) =>
        this.http.request<FetchGithubTokenResponseDTO, any>({
            path: `/third-part/github/fetch_token`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags ThirdPart
     * @name ThirdPartControllerQueryUser
     * @request POST:/third-part/github/query_user
     */
    queryUser = (data: QueryGithubUserDTO, params: RequestParams = {}) =>
        this.http.request<ThirdPartDTO, any>({
            path: `/third-part/github/query_user`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags ThirdPart
     * @name ThirdPartControllerCreateUser
     * @request POST:/third-part/github/create
     */
    createUser = (data: CreateGithubUserDTO, params: RequestParams = {}) =>
        this.http.request<ThirdPartDTO, any>({
            path: `/third-part/github/create`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags ThirdPart
     * @name ThirdPartControllerLoginWithGithub
     * @request POST:/third-part/github/login
     */
    loginWithGithub = (data: LoginDTO, params: RequestParams = {}) =>
        this.http.request<RegisterResponseDTO, any>({
            path: `/third-part/github/login`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
}
const client = new HttpClient({ baseURL: `http://localhost:3001/` });
export default new ThirdPart(client);

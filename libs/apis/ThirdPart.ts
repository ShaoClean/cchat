import {
    CreateGithubUserDTO,
    FetchGithubTokenDTO,
    FetchGithubTokenResponseDTO,
    LoginDTO,
    QueryGithubUserDTO,
    RegisterResponseDTO,
    ThirdPartControllerThirdPartLoginRedirectParams,
    ThirdPartDTO,
    ThirdPartProvider,
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
     * @request GET:/third-part/{provider}/login_redirect
     */
    thirdPartLoginRedirect = ({ provider, ...query }: ThirdPartControllerThirdPartLoginRedirectParams, params: RequestParams = {}) =>
        this.http.request<void, any>({
            path: `/third-part/${provider}/login_redirect`,
            method: 'GET',
            query: query,
            ...params,
        });
    /**
     * No description
     *
     * @tags ThirdPart
     * @name ThirdPartControllerFetchToken
     * @request POST:/third-part/{provider}/fetch_token
     */
    fetchToken = (provider: ThirdPartProvider, data: FetchGithubTokenDTO, params: RequestParams = {}) =>
        this.http.request<FetchGithubTokenResponseDTO, any>({
            path: `/third-part/${provider}/fetch_token`,
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
     * @request POST:/third-part/{provider}/query_user
     */
    queryUser = (provider: ThirdPartProvider, data: QueryGithubUserDTO, params: RequestParams = {}) =>
        this.http.request<ThirdPartDTO, any>({
            path: `/third-part/${provider}/query_user`,
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
     * @request POST:/third-part/{provider}/create
     */
    createUser = (provider: ThirdPartProvider, data: CreateGithubUserDTO, params: RequestParams = {}) =>
        this.http.request<ThirdPartDTO, any>({
            path: `/third-part/${provider}/create`,
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
     * @name ThirdPartControllerLogin
     * @request POST:/third-part/{provider}/login
     */
    login = (provider: ThirdPartProvider, data: LoginDTO, params: RequestParams = {}) =>
        this.http.request<RegisterResponseDTO, any>({
            path: `/third-part/${provider}/login`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
}
const client = new HttpClient({ baseURL: `http://localhost:3001/` });
export default new ThirdPart(client);

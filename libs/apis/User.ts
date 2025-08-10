import { HttpClient, RequestParams } from './http-client';

export class User<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;
    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * No description
     *
     * @tags User
     * @name UserControllerGetProfile
     * @request GET:/user/profile
     */
    getProfile = (params: RequestParams = {}) =>
        this.http.request<void, any>({
            path: `/user/profile`,
            method: 'GET',
            ...params,
        });
}
const client = new HttpClient({ baseURL: `http://localhost:3001/api` });
export default new User(client);

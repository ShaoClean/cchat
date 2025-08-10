import { HttpClient, RequestParams } from './http-client';

export class Room<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;
    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * No description
     *
     * @tags Room
     * @name RoomControllerCreate
     * @request POST:/room/create
     */
    create = (params: RequestParams = {}) =>
        this.http.request<void, any>({
            path: `/room/create`,
            method: 'POST',
            ...params,
        });
    /**
     * No description
     *
     * @tags Room
     * @name RoomControllerGetAll
     * @request POST:/room/get_all
     */
    getAll = (params: RequestParams = {}) =>
        this.http.request<void, any>({
            path: `/room/get_all`,
            method: 'POST',
            ...params,
        });
}
const client = new HttpClient({ baseURL: `http://localhost:3001/` });
export default new Room(client);

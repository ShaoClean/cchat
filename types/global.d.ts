// https://stackoverflow.com/questions/38906359/create-a-global-variable-in-typescript
// have any import or export use global
interface Interceptor<T> {
    code: number;
    data: T;
    message: string;
    success: boolean;
    timestamp: string;
}

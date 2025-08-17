import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Interceptor<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Interceptor<T>> {
        const req = context.switchToHttp().getRequest<Request>();
        const url = req.url;
        const exclude = ['/third-part/github/login_redirect'];
        if (exclude.some(path => url.startsWith(path))) {
            return next.handle(); // 不做处理，直接返回原始数据
        }
        return next.handle().pipe(
            map(data => ({
                code: 0, // 0 表示成功
                data,
                message: 'Success',
                success: true,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Interceptor<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Interceptor<T>> {
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

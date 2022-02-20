import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ServiceUnavailableException } from '@nestjs/common';
import { catchError, Observable, throwError, timeout } from 'rxjs';
import { MustBeEntityError, QueryFailedError } from 'typeorm';

@Injectable()
export class ServiceInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response> {
    return next.handle().pipe(
      timeout(3000),
      catchError((err) => {
        if (err instanceof QueryFailedError || err instanceof MustBeEntityError || err instanceof TypeError) {
          return throwError(() => new ServiceUnavailableException('failed to execute'));
        }
        return throwError(() => err);
      }),
    );
  }
}
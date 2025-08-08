import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import {
  RATE_LIMIT_KEY,
  RateLimitOptions,
} from '../decorators/rate-limit.decorator';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private readonly store = new Map<
    string,
    { count: number; resetTime: number }
  >();

  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rateLimitOptions = this.reflector.get<RateLimitOptions>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    if (!rateLimitOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const key = this.generateKey(request, rateLimitOptions);
    const now = Date.now();

    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + rateLimitOptions.windowMs,
      });
      return next.handle();
    }

    if (record.count >= rateLimitOptions.max) {
      const remainingTime = Math.ceil((record.resetTime - now) / 1000);
      throw new BadRequestException(
        `Rate limit exceeded. Try again in ${remainingTime} seconds.`,
      );
    }

    record.count++;
    this.store.set(key, record);

    return next.handle();
  }

  private generateKey(request: any, options: RateLimitOptions): string {
    if (options.keyGenerator) {
      return options.keyGenerator(request);
    }

    const ip = request.ip || request.connection.remoteAddress;
    const endpoint = `${request.method}:${request.route?.path || request.url}`;
    const userId = request.body?.userId || 'anonymous';

    return `${ip}:${endpoint}:${userId}`;
  }
}

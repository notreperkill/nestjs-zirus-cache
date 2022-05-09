import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { isFunctionGuard } from '../utils';
import { Observable, of, tap } from 'rxjs';
import {
  CACHE_COND_METADATA,
  CACHE_KEY_METADATA,
  CACHE_MANAGER,
  CACHE_TTL_METADATA
} from '../cache.constants';
import { condType, key, TTLtype } from '../types';

@Injectable()
export class ZirusCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(Reflector.name) private readonly reflector: Reflector
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<unknown>> {
    const request: Request = context.switchToHttp().getRequest();
    const condition = this.reflector.get<condType>(
      CACHE_COND_METADATA,
      context.getHandler()
    );

    if (!condition(context)) return next.handle();
    if (request.method !== 'GET') return next.handle();

    const keyValueOrFactory = this.reflector.get<key>(
      CACHE_KEY_METADATA,
      context.getHandler()
    );

    const ttlValueOrFactory = this.reflector.get<TTLtype>(
      CACHE_TTL_METADATA,
      context.getHandler()
    );

    const cacheKey = isFunctionGuard(keyValueOrFactory)
      ? keyValueOrFactory(context)
      : keyValueOrFactory || request.url;

    const ttl = isFunctionGuard(ttlValueOrFactory)
      ? ttlValueOrFactory(context)
      : ttlValueOrFactory || 0;

    const value = await this.cacheManager.get<unknown>(cacheKey);

    if (value !== undefined) {
      return of(value);
    } else {
      return next.handle().pipe(
        tap(
          async (response) =>
            await this.cacheManager.set(cacheKey, response, {
              ttl: ttl
            })
        )
      );
    }
  }
}

import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { isFunction } from '../utils';
import { Observable, of, tap } from 'rxjs';
import {
  CACHE_COND_METADATA,
  CACHE_KEY_METADATA,
  CACHE_MANAGER,
  CACHE_TRACKER_METADATA,
  CACHE_TTL_METADATA
} from '../cache.constants';

@Injectable()
export class ZirusCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(Reflector.name) private readonly reflector: Reflector
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {

    const request = context.switchToHttp().getRequest();
    const condition = await this.reflector.get(CACHE_COND_METADATA, context.getHandler());

    if (isFunction(condition) && !condition(context)) return next.handle();
    if (request.method !== 'GET') return next.handle();

    const cacheKey =
      this.reflector.get<string>(CACHE_KEY_METADATA, context.getHandler()) ||
      await this.reflector.get(CACHE_TRACKER_METADATA, context.getHandler())?.(context) ||
      request.url;

    const value = await this.cacheManager.get(cacheKey);

    const ttlValueOrFactory = this.reflector.get(
      CACHE_TTL_METADATA,
      context.getHandler()
    );
    
    const ttl =
      isFunction(ttlValueOrFactory)
        ? await ttlValueOrFactory(context)
        : ttlValueOrFactory || 0;
    
    
    if (value !== undefined) {
      return of(value);
    } else {
      return next.handle().pipe(
        tap(
          async (response) =>
            await this.cacheManager.set(cacheKey, await response, {
              ttl: ttl
            })
        )
      );
    }
  }
}

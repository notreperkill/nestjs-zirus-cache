
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>
<p align="center">
  A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.
</p>


# zirus-cache
zirus-cache for Nest.JS - simple and modern cache library

## Simple example

```typescript
@CacheMethod()
@Get()
async getData(): Promise<string[]> {
  return data;
}

```

## Installation

```shell
npm install cache-manager
npm install -D @types/cache-manager
npm install nestjs-zirus-cache
```


## Basic usage

### Import `ZirusModule`

```typescript
@Module({
  imports: [
    ZirusModule.forRoot(),

    // Async registration
    ZirusModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => (({
        store: configService.get('STORE')
      })),
      inject: [ConfigService]
    }),
  ],
})
export class AppModule {}

```



## Customize caching


```typescript
@Module({
  imports: [
    ZirusModule.forRoot({
        store: 'memory', 
        ttl: 0, //time to live 
        max: 100 // max items in cache
    })
  ],
})
export class AppModule {}

```

### Also you can use different storage like Redis:

```shell
npm install cache-manager-redis-store
```

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ZirusModule.forRoot({
      store: redisStore,
      max: 100,

      socket: {
        host: 'localhost',
        port: 6379
      }
  })
  ],
  controllers: [AppController]
})
export class AppModule {}
```

More storages: https://www.npmjs.com/package/cache-manager

## Decorators

### `@CacheMethod()`

This decorator can use for controller or endpoint alone

It should be used on any endpoint you want to cache (if it is not used globally on controller)

```typescript
@CacheMethod()
@Controller()
export class DataController {
  @Get()
  async getData(): Promise<string[]> {
    return data;
  }

```

All GET methods of controller wil be cached

For one endpoint:

```typescript

@Controller()
export class DataController {
  @CacheMethod()
  @Get()
  async getData(): Promise<string[]> {
    return data;
  }

```

### `@SetCacheKey()`

This decorator sets a specific cache key for endpoint

By default, the key is generated from the URL (including query parameters)


```typescript
  @SetCacheKey('key')
  @Get()
  async getData(): Promise<string[]> {
    return data;
  }
```

```typescript
  @SetCacheKey((context: ExecutionContext) => {
    return context.switchToHttp().getRequest().headers.authorization
  })
  @Get()
  async getData(): Promise<string[]> {
    return data;
  }

```

### `@SetCacheTTL()`

This decorator sets a specific TTL for endpoint

By default is 0


```typescript
  @SetCacheTTL(10)
  @Get()
  async getData(): Promise<string[]> {
    return data;
  }
```

```typescript
  @SetCacheTTL((context: ExecutionContext) => {
  const headers = context.switchToHttp().getRequest().headers;

  if (headers.flag !== undefined) {
    return 5;
  }

  return 0;
})

```


### `@SetCond()`

This decorator determines will be endpoint cached or not
It will be cached if the condition is true

```typescript
  @SetCond((context) => {
    return context.switchToHttp().getRequest().headers.authorization !== undefined
  })
  @Get()
  async getData(): Promise<string[]> {
    return data;
  }
```

### `@Exclude()`
This decorator can be used when you don't need to cache one or more endpoints

Example:

```typescript
@CacheMethod()
@Controller()
export class AppController {

  @Get('/foo')
  async foo(): Promise<string[]> {
    return data;
  }

  @Exclude()
  @Get('/bar')
  async bar(): Promise<string[]> {
    return data;
  }

}

```

/bar endpoint will not be cached

@Exclude() decorator is literally short entry for

```typescript
  @SetCond(() => {
    return false;
})

```

## Own logics

if you need work with cache-manager, you can:

```typescript
constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
```

##### Note: 

```typescript
import { CACHE_MANAGER } from 'nestjs-zirus-cache';
import { Cache } from 'cache-manager';
```

import { CacheModuleAsyncOptions, CacheModuleOptions, DynamicModule, Global, Module } from '@nestjs/common';
import * as cacheManager from 'cache-manager';
import { CACHE_MANAGER } from './cache.constants';
import { defaultCacheOptions } from './default-options';



@Global()
@Module({})
export class ZirusModule {
  static forRoot<StoreConfig extends Record<any, any> = Record<string, any>>(options: CacheModuleOptions<StoreConfig> = {} as any): DynamicModule {  
    return {
      module: ZirusModule,
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: Array.isArray(options)
            ? cacheManager.multiCaching(options.map(
              (option: any) => 
                cacheManager.caching({
                  ...defaultCacheOptions,
                  ...option
                }
                )
            ))
            : cacheManager.caching(
              {...defaultCacheOptions, ...options} as cacheManager.StoreConfig & cacheManager.CacheOptions
            )
        }
      ],
      exports: [CACHE_MANAGER]
    };
  }

  static forRootAsync<StoreConfig extends Record<any, any> = Record<string, any>>(options: CacheModuleAsyncOptions<StoreConfig>): DynamicModule {
    return {
      module: ZirusModule,
      imports: options.imports || [],
      providers: [
        {
          provide: CACHE_MANAGER,
          useFactory: (...args) => {
            const cacheOptions = options.useFactory(...args);
            Array.isArray(cacheOptions)
              ? cacheManager.multiCaching(cacheOptions.map(
                (option: any) => 
                  cacheManager.caching({
                    ...defaultCacheOptions,
                    ...option
                  }
                  )
              ))
              : cacheManager.caching(
              {...defaultCacheOptions, ...cacheOptions} as cacheManager.StoreConfig & cacheManager.CacheOptions
              );
          },
          inject: options.inject || []
        }
      ],
      exports: [CACHE_MANAGER]
    };
  }



}

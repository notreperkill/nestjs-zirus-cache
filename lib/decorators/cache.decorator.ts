import { UseInterceptors } from '@nestjs/common';
import { ZirusCacheInterceptor } from '../interceptors';

export const CacheMethod = () => UseInterceptors(ZirusCacheInterceptor);

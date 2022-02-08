import { SetMetadata } from '@nestjs/common';
import { CACHE_KEY_METADATA } from '../cache.constants';

export const SetCacheKey = (key: string) => SetMetadata(CACHE_KEY_METADATA, key);
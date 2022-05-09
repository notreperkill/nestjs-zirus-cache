import { SetMetadata } from '@nestjs/common';
import { key } from '../types';
import { CACHE_KEY_METADATA } from '../cache.constants';

export const SetCacheKey = (key: key) => SetMetadata(CACHE_KEY_METADATA, key);

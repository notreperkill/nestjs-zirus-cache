import { SetMetadata } from '@nestjs/common';
import { TTLtype } from '../types';
import { CACHE_TTL_METADATA } from '../cache.constants';

export const SetCacheTTL = (ttl: TTLtype) =>
  SetMetadata(CACHE_TTL_METADATA, ttl);

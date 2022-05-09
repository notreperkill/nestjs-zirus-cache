import { SetMetadata } from '@nestjs/common';
import { condType } from '../types';
import { CACHE_COND_METADATA } from '../cache.constants';

export const SetCond = (cond: condType) =>
  SetMetadata(CACHE_COND_METADATA, cond);

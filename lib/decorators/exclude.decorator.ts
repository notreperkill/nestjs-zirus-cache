import { SetMetadata } from "@nestjs/common";
import { CACHE_COND_METADATA } from '../cache.constants';

export const Exclude = () => SetMetadata(CACHE_COND_METADATA, () => false);
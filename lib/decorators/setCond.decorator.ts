import { ExecutionContext, SetMetadata } from "@nestjs/common";
import { CACHE_COND_METADATA } from '../cache.constants';

export const SetCond = (cond: ((context: ExecutionContext) => boolean)) => SetMetadata(CACHE_COND_METADATA, cond);
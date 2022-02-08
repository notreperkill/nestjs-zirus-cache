import { ExecutionContext, SetMetadata } from "@nestjs/common";
import { CACHE_TTL_METADATA } from "../cache.constants";

export const SetCacheTTL = (ttl: number | ((context: ExecutionContext) => number)) => SetMetadata(CACHE_TTL_METADATA, ttl);
import { ExecutionContext, SetMetadata } from "@nestjs/common";
import { CACHE_TRACKER_METADATA } from '../cache.constants';

export const TrackBy = (tracker: ((context: ExecutionContext) => string | undefined)) => SetMetadata(CACHE_TRACKER_METADATA, tracker);
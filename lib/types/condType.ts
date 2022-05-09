import { ExecutionContext } from '@nestjs/common';

export type condType = (context: ExecutionContext) => boolean;

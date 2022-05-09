import { ExecutionContext } from '@nestjs/common';

export type key = string | ((context: ExecutionContext) => string | undefined);

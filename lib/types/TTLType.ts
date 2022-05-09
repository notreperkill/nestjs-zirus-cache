import { ExecutionContext } from '@nestjs/common';

export type TTLtype = number | ((context: ExecutionContext) => number);

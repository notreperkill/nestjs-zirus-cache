export const isFunctionGuard = (
  value: unknown
): value is (...args: unknown[]) => unknown => typeof value === 'string';

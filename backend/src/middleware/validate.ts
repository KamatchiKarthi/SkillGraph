import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../domain/errors.js';

type RequestPart = 'query' | 'params' | 'body';

export function validate<T>(
  schema: ZodSchema<T>,
  part: RequestPart = 'query',
  targetKey: 'validated' | 'validatedQuery' = 'validated',
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[part]);
    if (!parsed.success) {
      next(
        AppError.validation('Request validation failed', parsed.error.flatten()),
      );
      return;
    }
    (req as Request & Record<string, unknown>)[targetKey] = parsed.data;
    next();
  };
}

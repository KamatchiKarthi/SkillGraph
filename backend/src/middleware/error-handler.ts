import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../domain/errors.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    if (err.code === 'DB_UNAVAILABLE') {
      logger.error('Database unavailable', { message: err.message });
    }
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  logger.error('Unhandled error', {
    message: err instanceof Error ? err.message : 'unknown',
  });

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL',
      message: 'Internal server error',
      details: null,
    },
  });
}

export type ErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'DB_UNAVAILABLE'
  | 'INTERNAL';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details: unknown;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    details: unknown = null,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  static notFound(message: string): AppError {
    return new AppError('NOT_FOUND', message, 404);
  }

  static validation(message: string, details: unknown = null): AppError {
    return new AppError('VALIDATION_ERROR', message, 400, details);
  }

  static dbUnavailable(message = 'Graph database is unavailable'): AppError {
    return new AppError('DB_UNAVAILABLE', message, 503);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError('INTERNAL', message, 500);
  }
}

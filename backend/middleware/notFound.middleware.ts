import type { NextFunction, Request, Response } from 'express';
import { AppError } from './errorHandler.middleware.ts';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(
    new AppError(
      `API route ${req.method} ${req.originalUrl} does not exist.`,
      404,
      'ROUTE_NOT_FOUND'
    )
  );
}

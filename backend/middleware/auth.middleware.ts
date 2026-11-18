import type { NextFunction, Request, Response } from 'express';
import { AppError } from './errorHandler.middleware.ts';
import { verifyAuthToken, type AuthenticatedJwtPayload } from '../services/auth.service.ts';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedJwtPayload;
}

export function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : null;

    if (!token) {
      throw new AppError(
        'Authentication required. Please sign in to access this resource.',
        401,
        'UNAUTHORIZED'
      );
    }

    const decoded = verifyAuthToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    next(
      new AppError(
        'Invalid or expired authentication token.',
        401,
        'INVALID_TOKEN'
      )
    );
  }
}

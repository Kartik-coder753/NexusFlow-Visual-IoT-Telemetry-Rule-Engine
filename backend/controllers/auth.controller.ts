import type { NextFunction, Request, Response } from 'express';
import { getDatabaseStatus, isDatabaseConnected } from '../config/database.ts';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.ts';
import {
  createEphemeralPreviewSession,
  getAuthenticatedUser,
  loginUser,
  registerUser,
} from '../services/auth.service.ts';

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await loginUser(req.body);
    res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function previewSessionController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await createEphemeralPreviewSession(req.body ?? {});
    res.status(200).json({
      success: true,
      message:
        'Non-persistent preview session initialized. Configure MONGODB_URI for persistent authentication.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function meController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'No authenticated user found on request.',
      });
      return;
    }

    const user = await getAuthenticatedUser(req.user);
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export function logoutController(_req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    message: 'Session terminated.',
  });
}

export function authStatusController(_req: Request, res: Response): void {
  const database = getDatabaseStatus();
  const persistentReady = isDatabaseConnected();

  res.status(200).json({
    success: true,
    data: {
      persistentAuthReady: persistentReady,
      database,
      ephemeralPreviewAvailable: !persistentReady,
      pendingDatabaseRequirements: persistentReady
        ? []
        : [
            'MONGODB_URI must be configured for persistent user registration, login, and password verification against the Users collection.',
          ],
    },
  });
}

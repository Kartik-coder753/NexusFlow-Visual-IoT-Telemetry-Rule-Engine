import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.ts';
import { getOverviewSummary } from '../services/dashboard.service.ts';

export async function getOverviewController(
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const overview = await getOverviewSummary();
    res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    next(error);
  }
}

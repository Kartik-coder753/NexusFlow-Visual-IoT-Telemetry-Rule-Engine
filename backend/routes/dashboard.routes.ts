import { Router } from 'express';
import { getOverviewController } from '../controllers/dashboard.controller.ts';
import { requireAuth } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/overview', requireAuth, getOverviewController);

export default router;

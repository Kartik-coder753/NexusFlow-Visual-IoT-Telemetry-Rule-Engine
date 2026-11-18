import { Router } from 'express';
import healthRoutes from './health.routes.ts';
import authRoutes from './auth.routes.ts';
import dashboardRoutes from './dashboard.routes.ts';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

export default apiRouter;

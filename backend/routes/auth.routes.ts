import { Router } from 'express';
import { z } from 'zod';
import {
  authStatusController,
  loginController,
  logoutController,
  meController,
  previewSessionController,
  registerController,
} from '../controllers/auth.controller.ts';
import { requireAuth } from '../middleware/auth.middleware.ts';
import { validateRequest } from '../middleware/validate.middleware.ts';

const router = Router();

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters.')
    .max(80, 'Full name must be 80 characters or fewer.'),
  email: z.string().trim().email('Please provide a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password must be 128 characters or fewer.'),
  organization: z.string().trim().max(120).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const previewSessionSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    email: z.string().trim().email().optional(),
  })
  .optional();

router.get('/status', authStatusController);
router.post('/register', validateRequest({ body: registerSchema }), registerController);
router.post('/login', validateRequest({ body: loginSchema }), loginController);
router.post(
  '/preview-session',
  validateRequest({ body: previewSessionSchema }),
  previewSessionController
);
router.post('/logout', logoutController);
router.get('/me', requireAuth, meController);

export default router;

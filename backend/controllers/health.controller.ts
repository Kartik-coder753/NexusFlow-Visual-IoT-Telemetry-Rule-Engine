import type { Request, Response } from 'express';
import { getDatabaseStatus } from '../config/database.ts';
import { getSafeRuntimeDiagnostics } from '../config/diagnostics.ts';
import { env } from '../config/env.ts';

export function getHealth(_req: Request, res: Response): void {
  const database = getDatabaseStatus();
  const secretDiagnostics = getSafeRuntimeDiagnostics();

  res.status(200).json({
    success: true,
    service: 'NexusFlow API',
    tagline: 'Visual IoT Telemetry & Rule Engine',
    status: 'ok',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    database,
    environmentDiagnostics: secretDiagnostics,
    authentication: {
      passwordHashing: 'bcryptjs',
      tokenMechanism: 'jwt',
      persistentAuthReady: database.status === 'connected',
      jwtSecretConfigured: env.jwtSecretConfigured,
      pendingDependencies:
        database.status === 'connected'
          ? []
          : [
              'MONGODB_URI environment variable is not configured or reachable; persistent user registration and login require a MongoDB connection.',
            ],
    },
  });
}

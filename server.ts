import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase } from './backend/config/database.ts';
import { env } from './backend/config/env.ts';
import { errorHandler } from './backend/middleware/errorHandler.middleware.ts';
import { notFoundHandler } from './backend/middleware/notFound.middleware.ts';
import apiRouter from './backend/routes/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrapServer(): Promise<void> {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(','),
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Connect MongoDB if MONGODB_URI is configured; gracefully degrades to unconfigured state otherwise
  await connectDatabase();

  // API routes
  app.use('/api', apiRouter);

  // Unknown /api/* routes return structured JSON 404
  app.use('/api', notFoundHandler);

  // Serve Vite dev middleware in development or static dist in production
  if (env.nodeEnv !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  // Central error-handling middleware
  app.use(errorHandler);

  const server = app.listen(env.port, '0.0.0.0', () => {
    console.info(`[NexusFlow] Server listening on http://0.0.0.0:${env.port} (${env.nodeEnv})`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `[NexusFlow] Port ${env.port} is already in use. Another server instance may be running.`
      );
      process.exit(0);
    } else {
      console.error('[NexusFlow] Server instance error:', err);
    }
  });
}

bootstrapServer().catch((err) => {
  console.error('[NexusFlow] Fatal server startup error:', err);
  process.exit(1);
});

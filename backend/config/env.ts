import dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  nodeEnv: string;
  port: number;
  mongodbUri: string | null;
  jwtSecret: string;
  jwtSecretConfigured: boolean;
  jwtExpiresIn: string;
  corsOrigin: string;
  appUrl: string | null;
}

const rawPort = Number(process.env.PORT ?? 3000);
const envSecret = process.env.JWT_SECRET?.trim();

export const env: AppConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number.isFinite(rawPort) && rawPort > 0 ? rawPort : 3000,
  mongodbUri: process.env.MONGODB_URI?.trim() || null,
  jwtSecret: envSecret || 'nexusflow-dev-ephemeral-secret-change-in-production',
  jwtSecretConfigured: Boolean(envSecret),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || '7d',
  corsOrigin: process.env.CORS_ORIGIN?.trim() || '*',
  appUrl: process.env.APP_URL?.trim() || null,
};

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

const envSecret = process.env.JWT_SECRET?.trim();

export const env: AppConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: 3000, // Enforce port 3000 per environment constraints
  mongodbUri: process.env.MONGODB_URI?.trim() || null,
  jwtSecret: envSecret || 'nexusflow-dev-ephemeral-secret-change-in-production',
  jwtSecretConfigured: Boolean(envSecret),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || '7d',
  corsOrigin: process.env.CORS_ORIGIN?.trim() || '*',
  appUrl: process.env.APP_URL?.trim() || null,
};

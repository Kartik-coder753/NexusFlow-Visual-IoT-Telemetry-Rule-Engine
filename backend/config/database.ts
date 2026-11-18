import mongoose from 'mongoose';
import { env } from './env.ts';

export type DatabaseConnectionState =
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'unconfigured'
  | 'error';

export interface DatabaseStatusSnapshot {
  configured: boolean;
  status: DatabaseConnectionState;
  databaseName: string | null;
  host: string | null;
  lastError: string | null;
  lastCheckedAt: string;
}

let currentState: DatabaseConnectionState = env.mongodbUri ? 'disconnected' : 'unconfigured';
let lastError: string | null = env.mongodbUri
  ? null
  : 'MONGODB_URI environment variable is not configured.';

export async function connectDatabase(): Promise<DatabaseStatusSnapshot> {
  if (!env.mongodbUri) {
    currentState = 'unconfigured';
    lastError = 'MONGODB_URI environment variable is not configured.';
    console.warn(
      '[NexusFlow DB] MONGODB_URI is not set. Persistent database features (user accounts, devices, workflows, telemetry, alerts) remain dependent on MongoDB configuration.'
    );
    return getDatabaseStatus();
  }

  try {
    currentState = 'connecting';
    lastError = null;

    mongoose.connection.on('connected', () => {
      currentState = 'connected';
      lastError = null;
      console.info('[NexusFlow DB] MongoDB connected.');
    });

    mongoose.connection.on('disconnected', () => {
      currentState = 'disconnected';
      console.warn('[NexusFlow DB] MongoDB disconnected.');
    });

    mongoose.connection.on('error', (err) => {
      currentState = 'error';
      lastError = err instanceof Error ? err.message : 'Unknown MongoDB connection error';
      console.error('[NexusFlow DB] MongoDB error:', lastError);
    });

    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });

    currentState = 'connected';
    lastError = null;
  } catch (err) {
    currentState = 'error';
    lastError = err instanceof Error ? err.message : 'Failed to connect to MongoDB';
    console.error('[NexusFlow DB] Connection failed:', lastError);
  }

  return getDatabaseStatus();
}

export function isDatabaseConnected(): boolean {
  return currentState === 'connected' && mongoose.connection.readyState === 1;
}

export function getDatabaseStatus(): DatabaseStatusSnapshot {
  const isConnected = mongoose.connection.readyState === 1;
  return {
    configured: Boolean(env.mongodbUri),
    status: isConnected ? 'connected' : currentState,
    databaseName: isConnected ? mongoose.connection.name || null : null,
    host: isConnected ? mongoose.connection.host || null : null,
    lastError,
    lastCheckedAt: new Date().toISOString(),
  };
}

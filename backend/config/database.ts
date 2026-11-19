import mongoose from 'mongoose';
import { env } from './env.ts';

export type DatabaseConnectionState =
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'unconfigured'
  | 'error';

export type DatabaseErrorCategory =
  | 'credentials'
  | 'network_access'
  | 'dns'
  | 'database_configuration'
  | 'ssl_tls'
  | 'application_code'
  | 'unknown';

export interface DatabaseErrorDiagnosis {
  category: DatabaseErrorCategory;
  detailedDiagnosis: string;
  originalMessage: string;
}

export interface DatabaseStatusSnapshot {
  configured: boolean;
  status: DatabaseConnectionState;
  databaseName: string | null;
  host: string | null;
  lastError: string | null;
  errorDiagnosis: DatabaseErrorDiagnosis | null;
  lastCheckedAt: string;
}

let currentState: DatabaseConnectionState = env.mongodbUri ? 'disconnected' : 'unconfigured';
let lastError: string | null = env.mongodbUri
  ? null
  : 'MONGODB_URI environment variable is not configured.';
let lastErrorDiagnosis: DatabaseErrorDiagnosis | null = null;

export function classifyDatabaseError(err: unknown): DatabaseErrorDiagnosis {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  let category: DatabaseErrorCategory = 'unknown';
  let detailedDiagnosis = message;

  if (
    lower.includes('authentication failed') ||
    lower.includes('auth failed') ||
    lower.includes('bad auth') ||
    lower.includes('unauthorized')
  ) {
    category = 'credentials';
    detailedDiagnosis =
      'Authentication failed: The MongoDB username, password, or auth mechanism specified in MONGODB_URI is incorrect or lacks permissions on the target database.';
  } else if (
    lower.includes('ssl') ||
    lower.includes('tls') ||
    lower.includes('alert number 80') ||
    lower.includes('tlsv1 alert') ||
    lower.includes('certificate')
  ) {
    category = 'ssl_tls';
    detailedDiagnosis =
      'SSL/TLS Handshake Error: TLS alert or SSL handshake failure communicating with MongoDB Atlas. This often occurs due to Node.js TLS version negotiation differences, strict TLS policy, or network proxy inspection.';
  } else if (
    lower.includes('etimedout') ||
    lower.includes('econnrefused') ||
    lower.includes('timed out') ||
    lower.includes('server selection timed out') ||
    lower.includes('buffering timed out') ||
    lower.includes('could not connect to any servers')
  ) {
    category = 'network_access';
    detailedDiagnosis =
      'Network access / IP Whitelist restriction: Could not connect to any servers in your MongoDB Atlas cluster. Ensure your current network IP address is added to your MongoDB Atlas cluster Network Access IP Whitelist.';
  } else if (
    lower.includes('enotfound') ||
    lower.includes('getaddrinfo') ||
    lower.includes('resolver')
  ) {
    category = 'dns';
    detailedDiagnosis =
      'DNS resolution error: Unable to resolve the MongoDB host domain name specified in MONGODB_URI. Check hostname spelling, cluster URL, and DNS settings.';
  } else if (
    lower.includes('invalid scheme') ||
    lower.includes('connection string') ||
    lower.includes('uri') ||
    lower.includes('malformed') ||
    (lower.includes('mongodb://') === false && lower.includes('mongodb+srv://') === false)
  ) {
    category = 'database_configuration';
    detailedDiagnosis =
      'Database configuration error: The MONGODB_URI connection string format is malformed or missing the required mongodb:// or mongodb+srv:// scheme.';
  } else if (
    lower.includes('schema') ||
    lower.includes('validation') ||
    lower.includes('model')
  ) {
    category = 'application_code';
    detailedDiagnosis =
      'Application code / Mongoose model error during database initialization or schema compilation.';
  }

  return { category, detailedDiagnosis, originalMessage: message };
}

export async function connectDatabase(): Promise<DatabaseStatusSnapshot> {
  if (!env.mongodbUri) {
    currentState = 'unconfigured';
    lastError = 'MONGODB_URI environment variable is not set.';
    lastErrorDiagnosis = {
      category: 'database_configuration',
      detailedDiagnosis: 'MONGODB_URI environment variable is not set.',
      originalMessage: lastError,
    };
    console.warn(
      '[NexusFlow DB] MONGODB_URI is not set. Persistent database features remain dependent on MongoDB configuration.'
    );
    return getDatabaseStatus();
  }

  try {
    currentState = 'connecting';
    lastError = null;
    lastErrorDiagnosis = null;

    if (mongoose.connection.readyState === 1) {
      currentState = 'connected';
      return getDatabaseStatus();
    }

    mongoose.connection.on('connected', () => {
      currentState = 'connected';
      lastError = null;
      lastErrorDiagnosis = null;
      console.info('[NexusFlow DB] MongoDB connected successfully.');
    });

    mongoose.connection.on('disconnected', () => {
      currentState = 'disconnected';
      console.warn('[NexusFlow DB] MongoDB disconnected.');
    });

    mongoose.connection.on('error', (err) => {
      currentState = 'error';
      lastError = err instanceof Error ? err.message : 'Unknown MongoDB connection error';
      lastErrorDiagnosis = classifyDatabaseError(err);
      console.error('[NexusFlow DB] MongoDB error:', lastError);
    });

    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
      family: 4,
      tlsAllowInvalidCertificates: true,
    });

    currentState = 'connected';
    lastError = null;
    lastErrorDiagnosis = null;
  } catch (err) {
    currentState = 'error';
    lastError = err instanceof Error ? err.message : 'Failed to connect to MongoDB';
    lastErrorDiagnosis = classifyDatabaseError(err);
    console.error('[NexusFlow DB] Connection failed:', lastErrorDiagnosis.detailedDiagnosis);
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
    errorDiagnosis: lastErrorDiagnosis,
    lastCheckedAt: new Date().toISOString(),
  };
}

export type SystemHealthStatus = 'healthy' | 'degraded' | 'initializing';

export type DatabaseConnectionState =
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'unconfigured'
  | 'error';

export interface DatabaseStatus {
  configured: boolean;
  status: DatabaseConnectionState;
  databaseName: string | null;
  host: string | null;
  lastError: string | null;
  lastCheckedAt: string;
}

export interface ApiErrorPayload {
  success: false;
  code: string;
  message: string;
  details?: unknown;
}

export interface HealthResponse {
  success: boolean;
  service: string;
  tagline: string;
  status: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  database: DatabaseStatus;
  authentication: {
    passwordHashing: string;
    tokenMechanism: string;
    persistentAuthReady: boolean;
    jwtSecretConfigured: boolean;
    pendingDependencies: string[];
  };
}

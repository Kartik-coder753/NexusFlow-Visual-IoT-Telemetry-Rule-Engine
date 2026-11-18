import type { DatabaseStatus } from './common.types';

export type UserRole = 'admin' | 'operator' | 'viewer';
export type PersistenceMode = 'mongodb' | 'ephemeral_preview';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  createdAt: string;
  lastLoginAt: string | null;
  persistenceMode: PersistenceMode;
}

export interface AuthSessionData {
  token: string;
  user: AuthUser;
  persistenceMode: PersistenceMode;
}

export interface AuthStatusInfo {
  persistentAuthReady: boolean;
  database: DatabaseStatus;
  ephemeralPreviewAvailable: boolean;
  pendingDatabaseRequirements: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  organization?: string;
}

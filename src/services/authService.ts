import type {
  AuthSessionData,
  AuthStatusInfo,
  AuthUser,
  LoginCredentials,
  RegisterPayload,
} from '../types/auth.types';
import { apiRequest } from './apiClient';

interface ApiSuccess<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function fetchAuthStatus(): Promise<AuthStatusInfo> {
  const response = await apiRequest<ApiSuccess<AuthStatusInfo>>('/api/auth/status');
  return response.data;
}

export async function loginRequest(credentials: LoginCredentials): Promise<AuthSessionData> {
  const response = await apiRequest<ApiSuccess<AuthSessionData>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return response.data;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthSessionData> {
  const response = await apiRequest<ApiSuccess<AuthSessionData>>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function createPreviewSessionRequest(input?: {
  name?: string;
  email?: string;
}): Promise<AuthSessionData> {
  const response = await apiRequest<ApiSuccess<AuthSessionData>>('/api/auth/preview-session', {
    method: 'POST',
    body: JSON.stringify(input ?? {}),
  });
  return response.data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await apiRequest<ApiSuccess<{ user: AuthUser }>>('/api/auth/me');
  return response.data.user;
}

export async function logoutRequest(): Promise<void> {
  await apiRequest<{ success: boolean }>('/api/auth/logout', {
    method: 'POST',
  });
}

import type { HealthResponse } from '../types/common.types';
import { apiRequest } from './apiClient';

export async function fetchSystemHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/api/health');
}

import type { DashboardOverviewData } from '../types/dashboard.types';
import { apiRequest } from './apiClient';

interface ApiSuccess<T> {
  success: boolean;
  data: T;
}

export async function fetchDashboardOverview(): Promise<DashboardOverviewData> {
  const response = await apiRequest<ApiSuccess<DashboardOverviewData>>('/api/dashboard/overview');
  return response.data;
}

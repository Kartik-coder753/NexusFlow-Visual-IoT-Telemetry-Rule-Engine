import type { AlertRecord } from './alert.types';
import type { DatabaseStatus, SystemHealthStatus } from './common.types';
import type { DeviceRecord } from './device.types';
import type { TelemetryDataPoint } from './telemetry.types';
import type { WorkflowSummary } from './workflow.types';

export interface SystemActivityEvent {
  id: string;
  category: string;
  action: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export interface DashboardOverviewData {
  metrics: {
    totalDevices: number;
    onlineDevices: number;
    offlineDevices: number;
    activeWorkflows: number;
    totalTelemetryEvents: number;
    totalAlerts: number;
    systemHealth: {
      status: SystemHealthStatus;
      label: string;
      apiOnline: boolean;
      databaseConnected: boolean;
    };
  };
  telemetrySeries: TelemetryDataPoint[];
  devices: DeviceRecord[];
  activeWorkflows: WorkflowSummary[];
  recentAlerts: AlertRecord[];
  systemActivity: SystemActivityEvent[];
  database: DatabaseStatus;
}

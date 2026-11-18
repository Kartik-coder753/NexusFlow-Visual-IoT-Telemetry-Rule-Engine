import { getDatabaseStatus, isDatabaseConnected } from '../config/database.ts';
import { DeviceModel } from '../models/Device.model.ts';
import { WorkflowModel } from '../models/Workflow.model.ts';
import { AlertModel } from '../models/Alert.model.ts';
import { TelemetryModel } from '../models/Telemetry.model.ts';
import { ActivityLogModel } from '../models/ActivityLog.model.ts';

export interface OverviewSummaryDto {
  metrics: {
    totalDevices: number;
    onlineDevices: number;
    offlineDevices: number;
    activeWorkflows: number;
    totalTelemetryEvents: number;
    totalAlerts: number;
    systemHealth: {
      status: 'healthy' | 'degraded' | 'initializing';
      label: string;
      apiOnline: boolean;
      databaseConnected: boolean;
    };
  };
  telemetrySeries: Array<{
    timestamp: string;
    temperature: number | null;
    pressure: number | null;
    vibration: number | null;
    rpm: number | null;
  }>;
  devices: Array<{
    id: string;
    deviceId: string;
    name: string;
    type: string;
    location: string;
    protocol: string;
    status: 'online' | 'offline' | 'degraded';
    lastSeenAt: string | null;
  }>;
  activeWorkflows: Array<{
    id: string;
    name: string;
    status: 'active' | 'paused' | 'draft' | 'error';
    triggerType: string;
    executionCount: number;
    lastExecutedAt: string | null;
  }>;
  recentAlerts: Array<{
    id: string;
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'critical';
    state: 'open' | 'acknowledged' | 'resolved';
    deviceId: string | null;
    triggeredAt: string;
  }>;
  systemActivity: Array<{
    id: string;
    category: string;
    action: string;
    description: string;
    severity: 'info' | 'warning' | 'critical';
    timestamp: string;
  }>;
  database: ReturnType<typeof getDatabaseStatus>;
}

export async function getOverviewSummary(): Promise<OverviewSummaryDto> {
  const dbStatus = getDatabaseStatus();
  const dbReady = isDatabaseConnected();

  if (!dbReady) {
    return {
      metrics: {
        totalDevices: 0,
        onlineDevices: 0,
        offlineDevices: 0,
        activeWorkflows: 0,
        totalTelemetryEvents: 0,
        totalAlerts: 0,
        systemHealth: {
          status: 'degraded',
          label: 'API Ready · MongoDB Unconfigured',
          apiOnline: true,
          databaseConnected: false,
        },
      },
      telemetrySeries: [],
      devices: [],
      activeWorkflows: [],
      recentAlerts: [],
      systemActivity: [],
      database: dbStatus,
    };
  }

  const [
    totalDevices,
    onlineDevices,
    offlineDevices,
    activeWorkflowsCount,
    totalTelemetryEvents,
    totalAlerts,
    telemetryDocs,
    deviceDocs,
    workflowDocs,
    alertDocs,
    activityDocs,
  ] = await Promise.all([
    DeviceModel.countDocuments(),
    DeviceModel.countDocuments({ status: 'online' }),
    DeviceModel.countDocuments({ status: 'offline' }),
    WorkflowModel.countDocuments({ status: 'active' }),
    TelemetryModel.countDocuments(),
    AlertModel.countDocuments(),
    TelemetryModel.find().sort({ timestamp: -1 }).limit(30).lean(),
    DeviceModel.find().sort({ updatedAt: -1 }).limit(8).lean(),
    WorkflowModel.find().sort({ updatedAt: -1 }).limit(6).lean(),
    AlertModel.find().sort({ triggeredAt: -1 }).limit(6).lean(),
    ActivityLogModel.find().sort({ timestamp: -1 }).limit(8).lean(),
  ]);

  return {
    metrics: {
      totalDevices,
      onlineDevices,
      offlineDevices,
      activeWorkflows: activeWorkflowsCount,
      totalTelemetryEvents,
      totalAlerts,
      systemHealth: {
        status: 'healthy',
        label: 'Operational',
        apiOnline: true,
        databaseConnected: true,
      },
    },
    telemetrySeries: telemetryDocs
      .slice()
      .reverse()
      .map((doc) => ({
        timestamp: doc.timestamp.toISOString(),
        temperature: doc.temperature,
        pressure: doc.pressure,
        vibration: doc.vibration,
        rpm: doc.rpm,
      })),
    devices: deviceDocs.map((doc) => ({
      id: doc._id.toString(),
      deviceId: doc.deviceId,
      name: doc.name,
      type: doc.type,
      location: doc.location,
      protocol: doc.protocol,
      status: doc.status,
      lastSeenAt: doc.lastSeenAt ? doc.lastSeenAt.toISOString() : null,
    })),
    activeWorkflows: workflowDocs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      status: doc.status,
      triggerType: doc.triggerType,
      executionCount: doc.executionCount,
      lastExecutedAt: doc.lastExecutedAt ? doc.lastExecutedAt.toISOString() : null,
    })),
    recentAlerts: alertDocs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      message: doc.message,
      severity: doc.severity,
      state: doc.state,
      deviceId: doc.deviceId,
      triggeredAt: doc.triggeredAt.toISOString(),
    })),
    systemActivity: activityDocs.map((doc) => ({
      id: doc._id.toString(),
      category: doc.category,
      action: doc.action,
      description: doc.description,
      severity: doc.severity,
      timestamp: doc.timestamp.toISOString(),
    })),
    database: dbStatus,
  };
}

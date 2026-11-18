import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  Bell,
  Clock,
  Cpu,
  GitBranch,
  HeartPulse,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataTable, type TableColumn } from '../components/common/DataTable';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { MetricCard } from '../components/common/MetricCard';
import { StatusIndicator } from '../components/common/StatusIndicator';
import { useAuth } from '../context/AuthContext';
import { SystemReadinessBanner } from '../features/dashboard/SystemReadinessBanner';
import { TelemetryOverviewGrid } from '../features/dashboard/TelemetryOverviewGrid';
import { fetchDashboardOverview } from '../services/dashboardService';
import type { AlertRecord } from '../types/alert.types';
import type { DashboardOverviewData, SystemActivityEvent } from '../types/dashboard.types';
import type { DeviceRecord } from '../types/device.types';
import type { WorkflowSummary } from '../types/workflow.types';
import { formatNumber, formatTimestamp } from '../utils/formatters';

export function OverviewPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const overview = await fetchDashboardOverview();
      setData(overview);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load dashboard overview.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const deviceColumns: TableColumn<DeviceRecord>[] = [
    {
      key: 'name',
      header: 'Device',
      render: (row) => (
        <div>
          <span className="font-medium text-slate-100 block">{row.name}</span>
          <span className="text-xs font-mono text-slate-400">{row.deviceId}</span>
        </div>
      ),
    },
    {
      key: 'protocol',
      header: 'Protocol',
      render: (row) => (
        <span className="font-mono text-xs text-slate-300 uppercase">{row.protocol}</span>
      ),
    },
    {
      key: 'status',
      header: 'Connectivity',
      render: (row) => (
        <StatusIndicator
          label={row.status === 'online' ? 'Online' : row.status === 'degraded' ? 'Degraded' : 'Offline'}
          tone={row.status === 'online' ? 'success' : row.status === 'degraded' ? 'warning' : 'neutral'}
        />
      ),
    },
    {
      key: 'lastSeenAt',
      header: 'Last Seen',
      align: 'right',
      render: (row) => (
        <span className="font-mono text-xs text-slate-400">
          {formatTimestamp(row.lastSeenAt)}
        </span>
      ),
    },
  ];

  const workflowColumns: TableColumn<WorkflowSummary>[] = [
    {
      key: 'name',
      header: 'Workflow',
      render: (row) => <span className="font-medium text-slate-100">{row.name}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <StatusIndicator
          label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          tone={
            row.status === 'active'
              ? 'success'
              : row.status === 'error'
                ? 'critical'
                : 'neutral'
          }
        />
      ),
    },
    {
      key: 'lastExecutedAt',
      header: 'Last Execution',
      align: 'right',
      render: (row) => (
        <span className="font-mono text-xs text-slate-400">
          {formatTimestamp(row.lastExecutedAt)}
        </span>
      ),
    },
  ];

  const alertColumns: TableColumn<AlertRecord>[] = [
    {
      key: 'title',
      header: 'Event',
      render: (row) => (
        <div className="min-w-0">
          <span className="font-medium text-slate-100 block truncate">{row.title}</span>
          <span className="text-xs text-slate-400 block truncate">{row.message}</span>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (row) => (
        <StatusIndicator
          label={row.severity.charAt(0).toUpperCase() + row.severity.slice(1)}
          tone={
            row.severity === 'critical'
              ? 'critical'
              : row.severity === 'warning'
                ? 'warning'
                : 'info'
          }
        />
      ),
    },
    {
      key: 'triggeredAt',
      header: 'Triggered',
      align: 'right',
      render: (row) => (
        <span className="font-mono text-xs text-slate-400">
          {formatTimestamp(row.triggeredAt)}
        </span>
      ),
    },
  ];

  const activityColumns: TableColumn<SystemActivityEvent>[] = [
    {
      key: 'action',
      header: 'Event',
      render: (row) => (
        <div>
          <span className="font-medium text-slate-100 block">{row.action}</span>
          <span className="text-xs text-slate-400">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Scope',
      render: (row) => (
        <span className="text-xs font-mono text-slate-300">{row.category}</span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      align: 'right',
      render: (row) => (
        <span className="font-mono text-xs text-slate-400">
          {formatTimestamp(row.timestamp)}
        </span>
      ),
    },
  ];

  const metrics = data?.metrics;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
            Operations Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            NexusFlow telemetry readiness, device connectivity, active rule workflows, and system health
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadOverview()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#172338] border border-[#22324D] hover:border-[#3B82F6] text-xs font-medium text-slate-200 transition-colors whitespace-nowrap self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span>Refresh</span>
        </button>
      </div>

      {data && (
        <SystemReadinessBanner
          database={data.database}
          persistenceMode={user?.persistenceMode}
        />
      )}

      {error && (
        <ErrorMessage
          title="Dashboard telemetry unavailable"
          message={error}
          onRetry={() => void loadOverview()}
        />
      )}

      {/* 7 Required KPI Metric Cards */}
      <section aria-label="Key operational metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <MetricCard
            label="Total Devices"
            value={metrics ? formatNumber(metrics.totalDevices) : '0'}
            sublabel="Registered endpoints"
            icon={Cpu}
            tone="accent"
            loading={loading}
          />
          <MetricCard
            label="Online Devices"
            value={metrics ? formatNumber(metrics.onlineDevices) : '0'}
            sublabel="Active heartbeats"
            icon={Wifi}
            tone="success"
            loading={loading}
          />
          <MetricCard
            label="Offline Devices"
            value={metrics ? formatNumber(metrics.offlineDevices) : '0'}
            sublabel="Disconnected nodes"
            icon={WifiOff}
            tone="neutral"
            loading={loading}
          />
          <MetricCard
            label="Active Workflows"
            value={metrics ? formatNumber(metrics.activeWorkflows) : '0'}
            sublabel="Deployed rule graphs"
            icon={GitBranch}
            tone="accent"
            loading={loading}
          />
          <MetricCard
            label="Total Telemetry Events"
            value={metrics ? formatNumber(metrics.totalTelemetryEvents) : '0'}
            sublabel="Ingested payloads"
            icon={Activity}
            tone="neutral"
            loading={loading}
          />
          <MetricCard
            label="Total Alerts"
            value={metrics ? formatNumber(metrics.totalAlerts) : '0'}
            sublabel="Recorded incidents"
            icon={Bell}
            tone={metrics && metrics.totalAlerts > 0 ? 'warning' : 'neutral'}
            loading={loading}
          />
          <MetricCard
            label="System Health"
            value={
              metrics?.systemHealth.status === 'healthy'
                ? 'Healthy'
                : metrics?.systemHealth.status === 'degraded'
                  ? 'Degraded'
                  : 'Checking'
            }
            sublabel={metrics?.systemHealth.label || 'Verifying API & DB'}
            icon={HeartPulse}
            tone={metrics?.systemHealth.status === 'healthy' ? 'success' : 'warning'}
            loading={loading}
          />
        </div>
      </section>

      {/* Section A: Live Telemetry Overview */}
      <TelemetryOverviewGrid
        series={data?.telemetrySeries ?? []}
        loading={loading}
      />

      {/* Sections B & C: Device Status + Active Workflows */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="bg-[#172338] border border-[#22324D] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-100">Device Status</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Registered industrial devices and connectivity state
              </p>
            </div>
            <Link
              to="/devices"
              className="text-xs font-medium text-[#3B82F6] hover:underline whitespace-nowrap"
            >
              Manage devices
            </Link>
          </div>

          <DataTable
            columns={deviceColumns}
            rows={data?.devices ?? []}
            rowKey={(row) => row.id}
            loading={loading}
            emptyState={
              <EmptyState
                icon={Cpu}
                title="No devices registered"
                description="No IoT sensors or gateways have been registered in the device directory yet."
              />
            }
          />
        </section>

        <section className="bg-[#172338] border border-[#22324D] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-100">Active Workflows</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configured automation pipelines and execution status
              </p>
            </div>
            <Link
              to="/workflows"
              className="text-xs font-medium text-[#3B82F6] hover:underline whitespace-nowrap"
            >
              Open builder
            </Link>
          </div>

          <DataTable
            columns={workflowColumns}
            rows={data?.activeWorkflows ?? []}
            rowKey={(row) => row.id}
            loading={loading}
            emptyState={
              <EmptyState
                icon={GitBranch}
                title="No active workflows"
                description="Visual workflow rules and execution schedules will appear here once created."
              />
            }
          />
        </section>
      </div>

      {/* Sections D & E: Recent Alerts + System Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="bg-[#172338] border border-[#22324D] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-100">Recent Alerts</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Latest triggered threshold events and severity classification
              </p>
            </div>
            <Link
              to="/alerts"
              className="text-xs font-medium text-[#3B82F6] hover:underline whitespace-nowrap"
            >
              View alert log
            </Link>
          </div>

          <DataTable
            columns={alertColumns}
            rows={data?.recentAlerts ?? []}
            rowKey={(row) => row.id}
            loading={loading}
            emptyState={
              <EmptyState
                icon={Bell}
                title="No alerts triggered"
                description="Triggered rule violations and severity alerts will populate here when telemetry exceeds thresholds."
              />
            }
          />
        </section>

        <section className="bg-[#172338] border border-[#22324D] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-100">System Activity</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Audited authentication, ingestion, and platform events
              </p>
            </div>
            <Link
              to="/history"
              className="text-xs font-medium text-[#3B82F6] hover:underline whitespace-nowrap"
            >
              Execution history
            </Link>
          </div>

          <DataTable
            columns={activityColumns}
            rows={data?.systemActivity ?? []}
            rowKey={(row) => row.id}
            loading={loading}
            emptyState={
              <EmptyState
                icon={Clock}
                title="No system activity logged"
                description="Timestamped system events will be recorded here once MongoDB persistence is active."
              />
            }
          />
        </section>
      </div>
    </div>
  );
}

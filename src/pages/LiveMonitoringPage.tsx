import { useState } from 'react';
import { Activity } from 'lucide-react';
import { TelemetryOverviewGrid } from '../features/dashboard/TelemetryOverviewGrid';
import { StatusIndicator } from '../components/common/StatusIndicator';

export function LiveMonitoringPage() {
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'temperature' | 'pressure' | 'vibration' | 'rpm'>('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
            Live Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time industrial telemetry stream viewer and WebSocket gateway diagnostics
          </p>
        </div>

        <StatusIndicator label="Stream Socket Standby" tone="neutral" />
      </div>

      <div className="bg-[#172338] border border-[#22324D] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Activity className="w-4 h-4 text-[#3B82F6]" aria-hidden="true" />
          <span>Channel Filter</span>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-md bg-[#111C2E] border border-[#22324D] overflow-x-auto">
          {(['all', 'temperature', 'pressure', 'vibration', 'rpm'] as const).map((channel) => (
            <button
              key={channel}
              type="button"
              onClick={() => setSelectedChannel(channel)}
              className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                selectedChannel === channel
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {channel}
            </button>
          ))}
        </div>
      </div>

      <TelemetryOverviewGrid series={[]} />
    </div>
  );
}

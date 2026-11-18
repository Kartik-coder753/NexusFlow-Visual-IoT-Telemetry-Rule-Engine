import { useState } from 'react';
import { ChartContainer } from '../../components/common/ChartContainer';
import { TelemetryChart } from '../../components/common/TelemetryChart';
import type { TelemetryChannelMeta, TelemetryDataPoint } from '../../types/telemetry.types';

const CHANNELS: TelemetryChannelMeta[] = [
  {
    key: 'temperature',
    label: 'Temperature',
    unit: '°C',
    accentColor: '#3B82F6',
  },
  {
    key: 'pressure',
    label: 'Pressure',
    unit: 'kPa',
    accentColor: '#22C55E',
  },
  {
    key: 'vibration',
    label: 'Vibration',
    unit: 'mm/s',
    accentColor: '#F59E0B',
  },
  {
    key: 'rpm',
    label: 'Rotational Speed',
    unit: 'RPM',
    accentColor: '#60A5FA',
  },
];

type TimeWindow = '15m' | '1h' | '24h';

export interface TelemetryOverviewGridProps {
  series: TelemetryDataPoint[];
  loading?: boolean;
}

export function TelemetryOverviewGrid({
  series,
  loading = false,
}: TelemetryOverviewGridProps) {
  const [windowRange, setWindowRange] = useState<TimeWindow>('1h');

  const filteredSeries = (() => {
    if (series.length === 0) return [];
    const now = Date.now();
    const cutoffMs =
      windowRange === '15m'
        ? 15 * 60 * 1000
        : windowRange === '1h'
          ? 60 * 60 * 1000
          : 24 * 60 * 60 * 1000;
    return series.filter((pt) => now - new Date(pt.timestamp).getTime() <= cutoffMs);
  })();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100">
            Live Telemetry Overview
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time sensor channels across temperature, pressure, vibration, and RPM
          </p>
        </div>

        <div
          className="inline-flex items-center gap-1 p-1 rounded-md bg-[#111C2E] border border-[#22324D]"
          role="group"
          aria-label="Telemetry time window"
        >
          {(['15m', '1h', '24h'] as TimeWindow[]).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setWindowRange(range)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                windowRange === range
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CHANNELS.map((channel) => {
          const channelPoints = filteredSeries.map((pt) => ({
            timestamp: pt.timestamp,
            value: pt[channel.key],
          }));

          const latestPoint = [...channelPoints]
            .reverse()
            .find((pt) => pt.value !== null && Number.isFinite(pt.value));

          return (
            <ChartContainer
              key={channel.key}
              title={channel.label}
              unit={channel.unit}
              subtitle={`Window: ${windowRange}`}
              latestValue={
                latestPoint && latestPoint.value !== null
                  ? `${latestPoint.value.toFixed(1)}`
                  : '—'
              }
            >
              <TelemetryChart
                points={channelPoints}
                unit={channel.unit}
                strokeColor={channel.accentColor}
                loading={loading}
                emptyTitle={`No ${channel.label.toLowerCase()} readings ingested`}
                emptyDescription={`Connect a telemetry source or configure ingestion to record ${channel.label.toLowerCase()} (${channel.unit}) data.`}
              />
            </ChartContainer>
          );
        })}
      </div>
    </div>
  );
}

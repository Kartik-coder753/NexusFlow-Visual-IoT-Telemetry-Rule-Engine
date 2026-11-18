import { Activity } from 'lucide-react';
import { formatShortTime } from '../../utils/formatters';

export interface TelemetryChartPoint {
  timestamp: string;
  value: number | null;
}

export interface TelemetryChartProps {
  points: TelemetryChartPoint[];
  unit: string;
  strokeColor: string;
  emptyTitle: string;
  emptyDescription: string;
  loading?: boolean;
}

export function TelemetryChart({
  points,
  unit,
  strokeColor,
  emptyTitle,
  emptyDescription,
  loading = false,
}: TelemetryChartProps) {
  if (loading) {
    return (
      <div className="h-[180px] w-full rounded-md bg-[#111C2E]/60 border border-[#22324D]/60 animate-pulse" />
    );
  }

  const validPoints = points.filter(
    (point): point is { timestamp: string; value: number } =>
      point.value !== null && Number.isFinite(point.value)
  );

  if (validPoints.length === 0) {
    return (
      <div className="h-[180px] w-full rounded-md bg-[#0B1220]/50 border border-dashed border-[#22324D] flex flex-col items-center justify-center px-4 text-center">
        <Activity className="w-5 h-5 text-slate-500 mb-2" aria-hidden="true" />
        <p className="text-xs font-medium text-slate-300">{emptyTitle}</p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">{emptyDescription}</p>
      </div>
    );
  }

  const width = 460;
  const height = 160;
  const padLeft = 38;
  const padRight = 12;
  const padTop = 12;
  const padBottom = 24;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const values = validPoints.map((p) => p.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const span = rawMax - rawMin || 1;
  const minVal = rawMin - span * 0.1;
  const maxVal = rawMax + span * 0.1;

  const coords = validPoints.map((point, index) => {
    const x =
      validPoints.length === 1
        ? padLeft + plotW / 2
        : padLeft + (index / (validPoints.length - 1)) * plotW;
    const y =
      padTop + plotH - ((point.value - minVal) / (maxVal - minVal || 1)) * plotH;
    return { x, y, ...point };
  });

  const polylinePoints = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const yTicks = [maxVal, (maxVal + minVal) / 2, minVal];

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[180px] overflow-visible"
        role="img"
        aria-label={`Telemetry line chart in ${unit}`}
      >
        {yTicks.map((tick, idx) => {
          const y = padTop + (idx / 2) * plotH;
          return (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#22324D"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padLeft - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-slate-500 text-[10px] font-mono tabular-nums"
              >
                {tick.toFixed(1)}
              </text>
            </g>
          );
        })}

        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={polylinePoints}
        />

        {coords.map((pt, idx) => (
          <circle
            key={`${pt.timestamp}-${idx}`}
            cx={pt.x}
            cy={pt.y}
            r="2.5"
            fill={strokeColor}
          >
            <title>{`${formatShortTime(pt.timestamp)}: ${pt.value} ${unit}`}</title>
          </circle>
        ))}

        {coords.length > 0 && (
          <>
            <text
              x={padLeft}
              y={height - 4}
              textAnchor="start"
              className="fill-slate-500 text-[10px] font-mono tabular-nums"
            >
              {formatShortTime(coords[0].timestamp)}
            </text>
            {coords.length > 1 && (
              <text
                x={width - padRight}
                y={height - 4}
                textAnchor="end"
                className="fill-slate-500 text-[10px] font-mono tabular-nums"
              >
                {formatShortTime(coords[coords.length - 1].timestamp)}
              </text>
            )}
          </>
        )}
      </svg>
    </div>
  );
}

export type TelemetryMetricKey = 'temperature' | 'pressure' | 'vibration' | 'rpm';

export interface TelemetryDataPoint {
  timestamp: string;
  temperature: number | null;
  pressure: number | null;
  vibration: number | null;
  rpm: number | null;
}

export interface TelemetryChannelMeta {
  key: TelemetryMetricKey;
  label: string;
  unit: string;
  accentColor: string;
}

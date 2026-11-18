export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertState = 'open' | 'acknowledged' | 'resolved';

export interface AlertRecord {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  state: AlertState;
  deviceId: string | null;
  metric?: string | null;
  observedValue?: number | null;
  thresholdValue?: number | null;
  triggeredAt: string;
}

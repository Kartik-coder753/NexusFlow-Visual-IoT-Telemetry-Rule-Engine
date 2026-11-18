export type NotificationChannel = 'in_app' | 'webhook' | 'email';

export interface NotificationDispatchRequest {
  channel: NotificationChannel;
  recipient: string;
  subject: string;
  body: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface NotificationServiceContract {
  dispatch(request: NotificationDispatchRequest): Promise<{ delivered: boolean }>;
}

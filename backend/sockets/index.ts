import type { Server as HttpServer } from 'http';

export interface SocketGatewayContract {
  initialize(server: HttpServer): void;
  broadcastTelemetry(deviceId: string, payload: Record<string, unknown>): void;
  broadcastAlert(alert: Record<string, unknown>): void;
}

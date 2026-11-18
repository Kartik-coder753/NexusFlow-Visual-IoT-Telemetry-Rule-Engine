export type DeviceStatus = 'online' | 'offline' | 'degraded';
export type DeviceProtocol = 'mqtt' | 'http' | 'modbus' | 'opcua' | 'websocket';

export interface DeviceRecord {
  id: string;
  deviceId: string;
  name: string;
  type: string;
  location: string;
  protocol: DeviceProtocol | string;
  status: DeviceStatus;
  firmwareVersion?: string;
  lastSeenAt: string | null;
}

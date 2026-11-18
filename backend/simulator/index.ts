export interface SimulatorProfile {
  deviceId: string;
  intervalMs: number;
  enabled: boolean;
}

export interface DeviceSimulatorContract {
  start(profile: SimulatorProfile): void;
  stop(deviceId: string): void;
  listActive(): SimulatorProfile[];
}

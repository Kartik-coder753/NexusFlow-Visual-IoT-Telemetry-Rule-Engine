export interface TelemetryIngestPayload {
  deviceId: string;
  timestamp: string;
  metrics: {
    temperature?: number;
    pressure?: number;
    vibration?: number;
    rpm?: number;
  };
  raw?: Record<string, unknown>;
}

export interface IngestionPipelineContract {
  ingest(payload: TelemetryIngestPayload): Promise<{ accepted: boolean; reason?: string }>;
}

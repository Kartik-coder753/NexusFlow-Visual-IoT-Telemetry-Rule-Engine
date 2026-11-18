import mongoose, { Schema, type Document } from 'mongoose';

export interface ITelemetry extends Document {
  deviceId: string;
  timestamp: Date;
  temperature: number | null;
  pressure: number | null;
  vibration: number | null;
  rpm: number | null;
  metadata: Record<string, unknown>;
}

const telemetrySchema = new Schema<ITelemetry>(
  {
    deviceId: { type: String, required: true, trim: true, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    temperature: { type: Number, default: null },
    pressure: { type: Number, default: null },
    vibration: { type: Number, default: null },
    rpm: { type: Number, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: false, versionKey: false }
);

telemetrySchema.index({ deviceId: 1, timestamp: -1 });

export const TelemetryModel =
  (mongoose.models.Telemetry as mongoose.Model<ITelemetry>) ||
  mongoose.model<ITelemetry>('Telemetry', telemetrySchema);

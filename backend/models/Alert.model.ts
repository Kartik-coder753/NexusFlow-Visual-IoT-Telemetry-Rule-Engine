import mongoose, { Schema, type Document } from 'mongoose';

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertState = 'open' | 'acknowledged' | 'resolved';

export interface IAlert extends Document {
  title: string;
  message: string;
  severity: AlertSeverity;
  state: AlertState;
  deviceId: string | null;
  workflowId: mongoose.Types.ObjectId | null;
  metric: string | null;
  observedValue: number | null;
  thresholdValue: number | null;
  triggeredAt: Date;
  acknowledgedAt: Date | null;
  resolvedAt: Date | null;
}

const alertSchema = new Schema<IAlert>(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'warning',
      index: true,
    },
    state: {
      type: String,
      enum: ['open', 'acknowledged', 'resolved'],
      default: 'open',
      index: true,
    },
    deviceId: { type: String, default: null, index: true },
    workflowId: { type: Schema.Types.ObjectId, ref: 'Workflow', default: null },
    metric: { type: String, default: null },
    observedValue: { type: Number, default: null },
    thresholdValue: { type: Number, default: null },
    triggeredAt: { type: Date, default: Date.now, index: true },
    acknowledgedAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

export const AlertModel =
  (mongoose.models.Alert as mongoose.Model<IAlert>) || mongoose.model<IAlert>('Alert', alertSchema);

import mongoose, { Schema, type Document } from 'mongoose';

export type ActivityCategory = 'system' | 'auth' | 'device' | 'workflow' | 'alert';

export interface IActivityLog extends Document {
  category: ActivityCategory;
  action: string;
  description: string;
  actorId: string | null;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    category: {
      type: String,
      enum: ['system', 'auth', 'device', 'workflow', 'alert'],
      default: 'system',
      index: true,
    },
    action: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 300 },
    actorId: { type: String, default: null },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false, versionKey: false }
);

export const ActivityLogModel =
  (mongoose.models.ActivityLog as mongoose.Model<IActivityLog>) ||
  mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);

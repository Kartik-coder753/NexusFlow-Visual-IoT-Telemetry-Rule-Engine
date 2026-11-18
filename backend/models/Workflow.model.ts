import mongoose, { Schema, type Document } from 'mongoose';

export type WorkflowStatus = 'active' | 'paused' | 'draft' | 'error';

export interface IWorkflow extends Document {
  name: string;
  description: string;
  status: WorkflowStatus;
  triggerType: string;
  executionCount: number;
  lastExecutedAt: Date | null;
  nodes: Record<string, unknown>[];
  edges: Record<string, unknown>[];
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const workflowSchema = new Schema<IWorkflow>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', trim: true, maxlength: 400 },
    status: {
      type: String,
      enum: ['active', 'paused', 'draft', 'error'],
      default: 'draft',
      index: true,
    },
    triggerType: { type: String, default: 'telemetry_threshold', trim: true },
    executionCount: { type: Number, default: 0, min: 0 },
    lastExecutedAt: { type: Date, default: null },
    nodes: { type: Schema.Types.Mixed, default: [] },
    edges: { type: Schema.Types.Mixed, default: [] },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

export const WorkflowModel =
  (mongoose.models.Workflow as mongoose.Model<IWorkflow>) ||
  mongoose.model<IWorkflow>('Workflow', workflowSchema);

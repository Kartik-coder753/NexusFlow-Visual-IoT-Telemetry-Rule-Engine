import mongoose, { Schema, type Document } from 'mongoose';

export type DeviceStatus = 'online' | 'offline' | 'degraded';
export type DeviceProtocol = 'mqtt' | 'http' | 'modbus' | 'opcua' | 'websocket';

export interface IDevice extends Document {
  deviceId: string;
  name: string;
  type: string;
  location: string;
  protocol: DeviceProtocol;
  status: DeviceStatus;
  firmwareVersion: string;
  lastSeenAt: Date | null;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const deviceSchema = new Schema<IDevice>(
  {
    deviceId: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    type: { type: String, required: true, trim: true, maxlength: 60 },
    location: { type: String, default: 'Unassigned', trim: true, maxlength: 120 },
    protocol: {
      type: String,
      enum: ['mqtt', 'http', 'modbus', 'opcua', 'websocket'],
      default: 'mqtt',
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'degraded'],
      default: 'offline',
      index: true,
    },
    firmwareVersion: { type: String, default: '1.0.0', trim: true },
    lastSeenAt: { type: Date, default: null },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

export const DeviceModel =
  (mongoose.models.Device as mongoose.Model<IDevice>) ||
  mongoose.model<IDevice>('Device', deviceSchema);

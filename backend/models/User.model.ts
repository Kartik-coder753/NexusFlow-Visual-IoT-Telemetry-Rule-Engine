import mongoose, { Schema, type Document } from 'mongoose';

export type UserRole = 'admin' | 'operator' | 'viewer';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  organization: string;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'operator', 'viewer'],
      default: 'operator',
    },
    organization: {
      type: String,
      trim: true,
      default: 'Industrial Operations',
      maxlength: 120,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', userSchema);

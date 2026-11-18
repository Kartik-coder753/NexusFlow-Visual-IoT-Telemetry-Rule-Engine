import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.ts';
import { getDatabaseStatus, isDatabaseConnected } from '../config/database.ts';
import { UserModel, type UserRole } from '../models/User.model.ts';
import { ActivityLogModel } from '../models/ActivityLog.model.ts';
import { AppError } from '../middleware/errorHandler.middleware.ts';

export interface PublicUserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  createdAt: string;
  lastLoginAt: string | null;
  persistenceMode: 'mongodb' | 'ephemeral_preview';
}

export interface AuthenticatedJwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  organization: string;
  persistenceMode: 'mongodb' | 'ephemeral_preview';
}

export interface AuthResponseDto {
  token: string;
  user: PublicUserDto;
  persistenceMode: 'mongodb' | 'ephemeral_preview';
}

const BCRYPT_SALT_ROUNDS = 12;

export function signAuthToken(payload: AuthenticatedJwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAuthToken(token: string): AuthenticatedJwtPayload {
  const decoded = jwt.verify(token, env.jwtSecret);
  if (typeof decoded === 'string' || !decoded.sub) {
    throw new AppError('Invalid token payload.', 401, 'INVALID_TOKEN');
  }
  return {
    sub: String(decoded.sub),
    email: String(decoded.email),
    name: String(decoded.name),
    role: (decoded.role as UserRole) || 'operator',
    organization: String(decoded.organization || 'Industrial Operations'),
    persistenceMode:
      decoded.persistenceMode === 'mongodb' ? 'mongodb' : 'ephemeral_preview',
  };
}

function assertDatabaseReadyForPersistentAuth(): void {
  if (!isDatabaseConnected()) {
    const dbStatus = getDatabaseStatus();
    throw new AppError(
      'MongoDB is not connected. Persistent account registration and login require MONGODB_URI to be configured.',
      503,
      'DATABASE_NOT_CONFIGURED',
      {
        databaseStatus: dbStatus.status,
        configured: dbStatus.configured,
        pendingDependencies: [
          'Set MONGODB_URI environment variable to a reachable MongoDB instance.',
          'Restart backend server so Mongoose establishes the Users collection connection.',
        ],
      }
    );
  }
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  organization?: string;
}): Promise<AuthResponseDto> {
  assertDatabaseReadyForPersistentAuth();

  const normalizedEmail = input.email.trim().toLowerCase();
  const existing = await UserModel.findOne({ email: normalizedEmail }).lean();
  if (existing) {
    throw new AppError(
      'An account with this email address already exists.',
      409,
      'EMAIL_ALREADY_EXISTS'
    );
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);
  const created = await UserModel.create({
    name: input.name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'operator',
    organization: input.organization?.trim() || 'Industrial Operations',
    lastLoginAt: new Date(),
  });

  await ActivityLogModel.create({
    category: 'auth',
    action: 'user_registered',
    description: `Operator account registered for ${created.email}.`,
    actorId: created._id.toString(),
    severity: 'info',
  });

  const userDto: PublicUserDto = {
    id: created._id.toString(),
    name: created.name,
    email: created.email,
    role: created.role,
    organization: created.organization,
    createdAt: created.createdAt.toISOString(),
    lastLoginAt: created.lastLoginAt ? created.lastLoginAt.toISOString() : null,
    persistenceMode: 'mongodb',
  };

  const token = signAuthToken({
    sub: userDto.id,
    email: userDto.email,
    name: userDto.name,
    role: userDto.role,
    organization: userDto.organization,
    persistenceMode: 'mongodb',
  });

  return { token, user: userDto, persistenceMode: 'mongodb' };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthResponseDto> {
  assertDatabaseReadyForPersistentAuth();

  const normalizedEmail = input.email.trim().toLowerCase();
  const user = await UserModel.findOne({ email: normalizedEmail }).select('+passwordHash');

  if (!user) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  user.lastLoginAt = new Date();
  await user.save();

  await ActivityLogModel.create({
    category: 'auth',
    action: 'user_login',
    description: `Session authenticated for ${user.email}.`,
    actorId: user._id.toString(),
    severity: 'info',
  });

  const userDto: PublicUserDto = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    organization: user.organization,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    persistenceMode: 'mongodb',
  };

  const token = signAuthToken({
    sub: userDto.id,
    email: userDto.email,
    name: userDto.name,
    role: userDto.role,
    organization: userDto.organization,
    persistenceMode: 'mongodb',
  });

  return { token, user: userDto, persistenceMode: 'mongodb' };
}

/**
 * Issues an explicitly non-persistent JWT preview session ONLY when MongoDB
 * is not configured, allowing Phase 1 dashboard navigation & protected-route testing
 * without fabricating persistent database accounts.
 */
export async function createEphemeralPreviewSession(input: {
  name?: string;
  email?: string;
}): Promise<AuthResponseDto> {
  if (isDatabaseConnected()) {
    throw new AppError(
      'MongoDB is connected. Please sign in or register a persistent account.',
      400,
      'PERSISTENT_AUTH_ACTIVE'
    );
  }

  const now = new Date().toISOString();
  const name = input.name?.trim() || 'Phase 1 Operator';
  const email = input.email?.trim().toLowerCase() || 'operator@local.preview';

  // Hash a random ephemeral secret via bcryptjs to exercise password hashing pipeline
  await bcrypt.hash(`preview-${Date.now()}`, 8);

  const userDto: PublicUserDto = {
    id: `preview_${Date.now()}`,
    name,
    email,
    role: 'operator',
    organization: 'Local Preview (Non-Persistent)',
    createdAt: now,
    lastLoginAt: now,
    persistenceMode: 'ephemeral_preview',
  };

  const token = signAuthToken({
    sub: userDto.id,
    email: userDto.email,
    name: userDto.name,
    role: userDto.role,
    organization: userDto.organization,
    persistenceMode: 'ephemeral_preview',
  });

  return { token, user: userDto, persistenceMode: 'ephemeral_preview' };
}

export async function getAuthenticatedUser(
  payload: AuthenticatedJwtPayload
): Promise<PublicUserDto> {
  if (payload.persistenceMode === 'ephemeral_preview' || !isDatabaseConnected()) {
    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      organization: payload.organization,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      persistenceMode: 'ephemeral_preview',
    };
  }

  const user = await UserModel.findById(payload.sub).lean();
  if (!user) {
    throw new AppError('Authenticated user record not found.', 401, 'USER_NOT_FOUND');
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    organization: user.organization,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    persistenceMode: 'mongodb',
  };
}

export interface SecretDiagnosticInfo {
  name: string;
  exists: boolean;
  isEmpty: boolean;
  hasValidFormat: boolean;
}

export function getSafeRuntimeDiagnostics(): SecretDiagnosticInfo[] {
  const mongoUri = process.env.MONGODB_URI?.trim() || '';
  const jwtSecret = process.env.JWT_SECRET?.trim() || '';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN?.trim() || '';

  return [
    {
      name: 'MONGODB_URI',
      exists: Boolean(process.env.MONGODB_URI),
      isEmpty: mongoUri.length === 0,
      hasValidFormat:
        mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://'),
    },
    {
      name: 'JWT_SECRET',
      exists: Boolean(process.env.JWT_SECRET),
      isEmpty: jwtSecret.length === 0,
      hasValidFormat: jwtSecret.length >= 8,
    },
    {
      name: 'JWT_EXPIRES_IN',
      exists: Boolean(process.env.JWT_EXPIRES_IN),
      isEmpty: jwtExpiresIn.length === 0,
      hasValidFormat: jwtExpiresIn.length > 0,
    },
  ];
}

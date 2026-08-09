/**
 * Backend Configuration Platform — environment loading and validation.
 *
 * Mirrors the frontend's Configuration Platform (see ADR-014): every
 * layer reads config through this module, never through `process.env`
 * directly, and the app refuses to start if required variables are
 * missing or invalid (fail fast).
 */

export type AppEnvironment = "development" | "test" | "staging" | "production";

const VALID_ENVIRONMENTS: AppEnvironment[] = [
  "development",
  "test",
  "staging",
  "production",
];

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`[Configuration Error] Missing required environment variable: ${name}`);
  }

  return value;
}

function requirePort(name: string): number {
  const raw = requireEnv(name);
  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`[Configuration Error] Invalid ${name}: "${raw}" is not a valid port number`);
  }

  return parsed;
}

function requirePositiveInt(name: string): number {
  const raw = requireEnv(name);
  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`[Configuration Error] Invalid ${name}: "${raw}" must be a positive integer`);
  }

  return parsed;
}

const nodeEnv = process.env["NODE_ENV"] ?? "development";

if (!VALID_ENVIRONMENTS.includes(nodeEnv as AppEnvironment)) {
  throw new Error(
    `[Configuration Error] Invalid NODE_ENV: "${nodeEnv}". Valid values are: ${VALID_ENVIRONMENTS.join(", ")}`,
  );
}

export const env = {
  nodeEnv: nodeEnv as AppEnvironment,
  port: requirePort("PORT"),
  corsOrigin: requireEnv("CORS_ORIGIN"),
  databaseUrl: requireEnv("DATABASE_URL"),

  auth: {
    jwtAccessSecret: requireEnv("JWT_ACCESS_SECRET"),
    jwtAccessExpiresIn: requireEnv("JWT_ACCESS_EXPIRES_IN"),
    refreshTokenExpiresInDays: requirePositiveInt("REFRESH_TOKEN_EXPIRES_IN_DAYS"),
    bcryptSaltRounds: requirePositiveInt("BCRYPT_SALT_ROUNDS"),
    lockoutMaxAttempts: requirePositiveInt("ACCOUNT_LOCKOUT_MAX_ATTEMPTS"),
    lockoutDurationMinutes: requirePositiveInt("ACCOUNT_LOCKOUT_DURATION_MINUTES"),
  },
} as const;

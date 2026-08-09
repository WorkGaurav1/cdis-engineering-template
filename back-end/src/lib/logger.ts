import pino from "pino";

import { env } from "../config/index.js";

/**
 * Structured application logger.
 *
 * Redacts fields that must never reach log output (OWASP Logging Cheat
 * Sheet: never log credentials, tokens, or auth headers/cookies).
 */
export const logger = pino({
  // Test runs exercise every error path deliberately (401s, 403s, locked
  // accounts, etc.) — logging each one is noise, not signal, and floods
  // test output. Silent in test, debug locally, info in production.
  level: env.nodeEnv === "test" ? "silent" : env.nodeEnv === "production" ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
      "*.password",
      "*.passwordHash",
      "*.accessToken",
      "*.refreshToken",
      "*.token",
    ],
    censor: "[REDACTED]",
  },
  transport:
    env.nodeEnv === "development"
      ? { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname" } }
      : undefined,
});

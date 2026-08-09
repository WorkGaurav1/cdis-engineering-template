import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient } from "../../generated/prisma/client.js";
import { env } from "../config/index.js";

/**
 * Prisma Client singleton.
 *
 * Stored on `globalThis` in non-production environments so that `tsx watch`
 * hot reloads reuse the same client instead of opening a new connection
 * pool on every file change (a well-known Prisma + hot-reload pitfall).
 */

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaMariaDb(env.databaseUrl);

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}

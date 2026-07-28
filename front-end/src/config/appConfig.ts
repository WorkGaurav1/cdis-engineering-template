import { env } from "./env";

export const appConfig = {
  app: {
    name: env.appName,
    environment: env.appEnv,
  },
} as const;
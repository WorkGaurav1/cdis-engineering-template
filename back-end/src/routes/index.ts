import { Router } from "express";

import { authRouter } from "./auth.routes.js";
import { userRouter } from "./user.routes.js";

/**
 * Aggregates all versioned API routes. Mounted at /api/v1 in app.ts.
 *
 * Health checks are intentionally NOT under here — they're
 * infrastructure endpoints (used by container orchestration, load
 * balancers), not part of the versioned application API, so they're
 * mounted separately at the unversioned /health.
 */
export const apiV1Router = Router();

apiV1Router.use("/auth", authRouter);
apiV1Router.use("/users", userRouter);

import "express";

import type { SafeUser } from "../mappers/user.mapper.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      /** Populated (and cached) by requirePermission on first use per request. */
      user?: SafeUser;
    }
  }
}

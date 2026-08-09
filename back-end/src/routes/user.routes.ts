import { Router } from "express";

import { listUsers } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requirePermission } from "../middlewares/requirePermission.js";

export const userRouter = Router();

userRouter.get("/", requireAuth, requirePermission("users:read"), listUsers);

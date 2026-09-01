import { Router } from "express";

import { listUsers } from "../controllers/user.controller.js";
import { paginationQuerySchema } from "../data-transfer-object/pagination.dto.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requirePermission } from "../middlewares/requirePermission.js";
import { validateQuery } from "../middlewares/validate.js";

export const userRouter = Router();

userRouter.get("/", requireAuth, requirePermission("users:read"), validateQuery(paginationQuerySchema), listUsers);

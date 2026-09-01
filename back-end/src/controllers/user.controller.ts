import type { Request, Response } from "express";

import type { PaginationQuery } from "../data-transfer-object/pagination.dto.js";
import { userService } from "../services/user.service.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function listUsers(req: Request, res: Response): Promise<void> {
  // validateQuery(paginationQuerySchema) has already run — see user.routes.ts.
  const { limit, offset } = req.validatedQuery as PaginationQuery;
  const { users, total } = await userService.list({ limit, offset });

  sendSuccess(res, { users, pagination: { limit, offset, total } });
}

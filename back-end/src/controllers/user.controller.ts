import type { Request, Response } from "express";

import { userService } from "../services/user.service.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function listUsers(_req: Request, res: Response): Promise<void> {
  const users = await userService.list();
  sendSuccess(res, { users });
}

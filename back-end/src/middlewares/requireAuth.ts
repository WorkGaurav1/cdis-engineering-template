import type { NextFunction, Request, Response } from "express";

import { UnauthorizedError } from "../errors/index.js";
import { ACCESS_TOKEN_COOKIE } from "../lib/cookies.js";
import { tokenService } from "../services/token.service.js";

/**
 * Verifies the access token cookie and attaches the authenticated
 * user's id to the request. This is authentication ("who is this
 * request from") — role/permission checks build on top of req.userId
 * in Milestone 4's authorization guards.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[ACCESS_TOKEN_COOKIE] as string | undefined;

  if (!token) {
    next(new UnauthorizedError("Authentication is required."));
    return;
  }

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    next(new UnauthorizedError("Your session is invalid or has expired."));
  }
}

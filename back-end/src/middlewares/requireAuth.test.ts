import { describe, expect, it, vi } from "vitest";
import type { NextFunction } from "express";

import { createMockRequest } from "../test-utils/expressMocks.js";
import { UnauthorizedError } from "../errors/index.js";
import { tokenService } from "../services/token.service.js";
import { requireAuth } from "./requireAuth.js";
import { ACCESS_TOKEN_COOKIE } from "../lib/cookies.js";

describe("requireAuth", () => {
  it("rejects with UnauthorizedError when there is no access token cookie", () => {
    const req = createMockRequest({ cookies: {} });
    const next = vi.fn();

    requireAuth(req, {} as never, next as NextFunction);

    expect(next).toHaveBeenCalledExactlyOnceWith(expect.any(UnauthorizedError));
    expect(req.userId).toBeUndefined();
  });

  it("rejects with UnauthorizedError when the token is invalid or expired", () => {
    const req = createMockRequest({ cookies: { [ACCESS_TOKEN_COOKIE]: "not-a-real-jwt" } });
    const next = vi.fn();

    requireAuth(req, {} as never, next as NextFunction);

    expect(next).toHaveBeenCalledExactlyOnceWith(expect.any(UnauthorizedError));
    expect(req.userId).toBeUndefined();
  });

  it("attaches req.userId and calls next() with no error for a valid token", () => {
    const token = tokenService.signAccessToken("user-42");
    const req = createMockRequest({ cookies: { [ACCESS_TOKEN_COOKIE]: token } });
    const next = vi.fn();

    requireAuth(req, {} as never, next as NextFunction);

    expect(req.userId).toBe("user-42");
    expect(next).toHaveBeenCalledExactlyOnceWith();
  });
});

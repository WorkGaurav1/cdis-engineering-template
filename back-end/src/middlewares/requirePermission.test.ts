import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextFunction } from "express";

import { createMockRequest } from "../test-utils/expressMocks.js";
import { ForbiddenError, UnauthorizedError } from "../errors/index.js";

vi.mock("../services/auth.service.js", () => ({
  authService: {
    getCurrentUser: vi.fn(),
  },
}));

const { authService } = await import("../services/auth.service.js");
const { requirePermission } = await import("./requirePermission.js");

const safeUser = {
  id: "user-1",
  email: "test@example.com",
  name: "Test User",
  roles: ["manager"],
  permissions: ["users:read"],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("requirePermission", () => {
  it("rejects with UnauthorizedError when req.userId is not set (requireAuth didn't run)", async () => {
    const req = createMockRequest();
    const next = vi.fn();

    await requirePermission("users:read")(req, {} as never, next as NextFunction);

    expect(next).toHaveBeenCalledExactlyOnceWith(expect.any(UnauthorizedError));
    expect(authService.getCurrentUser).not.toHaveBeenCalled();
  });

  it("rejects with UnauthorizedError if the user record can't be loaded", async () => {
    vi.mocked(authService.getCurrentUser).mockRejectedValue(new Error("not found"));
    const req = createMockRequest({ userId: "user-1" });
    const next = vi.fn();

    await requirePermission("users:read")(req, {} as never, next as NextFunction);

    expect(next).toHaveBeenCalledExactlyOnceWith(expect.any(UnauthorizedError));
  });

  it("calls next() with no error when the user has the required permission", async () => {
    vi.mocked(authService.getCurrentUser).mockResolvedValue(safeUser);
    const req = createMockRequest({ userId: "user-1" });
    const next = vi.fn();

    await requirePermission("users:read")(req, {} as never, next as NextFunction);

    expect(next).toHaveBeenCalledExactlyOnceWith();
    expect(req.user).toEqual(safeUser);
  });

  it("rejects with ForbiddenError when the user lacks the required permission", async () => {
    vi.mocked(authService.getCurrentUser).mockResolvedValue(safeUser);
    const req = createMockRequest({ userId: "user-1" });
    const next = vi.fn();

    await requirePermission("users:write")(req, {} as never, next as NextFunction);

    expect(next).toHaveBeenCalledExactlyOnceWith(expect.any(ForbiddenError));
  });

  it("allows access if the user has at least one of several required permissions", async () => {
    vi.mocked(authService.getCurrentUser).mockResolvedValue(safeUser);
    const req = createMockRequest({ userId: "user-1" });
    const next = vi.fn();

    await requirePermission(["roles:manage", "users:read"])(req, {} as never, next as NextFunction);

    expect(next).toHaveBeenCalledExactlyOnceWith();
  });

  it("caches the loaded user on req.user and does not refetch on a second guard in the same request", async () => {
    vi.mocked(authService.getCurrentUser).mockResolvedValue(safeUser);
    const req = createMockRequest({ userId: "user-1" });
    const next = vi.fn();

    await requirePermission("users:read")(req, {} as never, next as NextFunction);
    await requirePermission("users:read")(req, {} as never, next as NextFunction);

    expect(authService.getCurrentUser).toHaveBeenCalledOnce();
  });
});

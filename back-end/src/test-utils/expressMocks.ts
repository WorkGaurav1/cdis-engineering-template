import type { Request } from "express";
import { vi } from "vitest";

/**
 * Minimal Express Request mock for middleware unit tests — only the
 * shape each middleware actually reads (cookies, header()) is real;
 * everything else is cast away rather than faked.
 */
export function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    cookies: {},
    header: vi.fn().mockReturnValue(undefined),
    ...overrides,
  } as unknown as Request;
}

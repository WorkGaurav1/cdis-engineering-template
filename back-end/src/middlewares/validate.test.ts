import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import type { NextFunction } from "express";

import { createMockRequest } from "../test-utils/expressMocks.js";
import { ValidationError } from "../errors/index.js";
import { validateBody } from "./validate.js";

const schema = z.object({
  email: z.email(),
  age: z.coerce.number().min(18, "Must be at least 18."),
});

describe("validateBody", () => {
  it("calls next() with no error and replaces req.body with the parsed data on success", () => {
    const req = createMockRequest({ body: { email: "a@example.com", age: "21" } });
    const next = vi.fn();

    validateBody(schema)(req, {} as never, next as NextFunction);

    expect(next).toHaveBeenCalledExactlyOnceWith();
    // age is coerced from string "21" to number 21 — proves req.body was
    // replaced with zod's parsed output, not left as the raw input.
    expect(req.body).toEqual({ email: "a@example.com", age: 21 });
  });

  it("calls next() with a ValidationError and leaves req.body untouched on failure", () => {
    const originalBody = { email: "not-an-email", age: "21" };
    const req = createMockRequest({ body: originalBody });
    const next = vi.fn();

    validateBody(schema)(req, {} as never, next as NextFunction);

    expect(next).toHaveBeenCalledExactlyOnceWith(expect.any(ValidationError));
    expect(req.body).toBe(originalBody);
  });

  it("joins multiple validation issues into a single message", () => {
    const req = createMockRequest({ body: { email: "not-an-email", age: "10" } });
    const next = vi.fn();

    validateBody(schema)(req, {} as never, next as NextFunction);

    const error = vi.mocked(next).mock.calls[0]![0] as ValidationError;
    expect(error.message).toMatch(/Must be at least 18\./);
    expect(error.message.split(" ").length).toBeGreaterThan(3);
  });
});

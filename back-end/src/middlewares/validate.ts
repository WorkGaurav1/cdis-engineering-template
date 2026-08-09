import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

import { ValidationError } from "../errors/index.js";

/**
 * Validates req.body against a zod schema and replaces it with the
 * parsed (and type-coerced/trimmed) result. Reusable across every route
 * that takes a body — this is the one place request validation happens.
 */
export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(" ");
      next(new ValidationError(message));
      return;
    }

    req.body = result.data;
    next();
  };
}

import { randomBytes, createHash } from "node:crypto";

import jwt from "jsonwebtoken";

import { env } from "../config/index.js";

export interface AccessTokenPayload {
  sub: string;
}

/**
 * Token generation/verification. Deliberately stateless and DB-free —
 * persistence of refresh tokens is the repository's job, this only
 * knows how to create and validate the token values themselves.
 */
export const tokenService = {
  signAccessToken(userId: string): string {
    return jwt.sign({ sub: userId } satisfies AccessTokenPayload, env.auth.jwtAccessSecret, {
      expiresIn: env.auth.jwtAccessExpiresIn as jwt.SignOptions["expiresIn"],
      algorithm: "HS256",
    });
  },

  verifyAccessToken(token: string): AccessTokenPayload {
    // Pinning the allow-list (rather than relying on jsonwebtoken's
    // default) means a token signed with any other algorithm is
    // rejected outright, instead of only working "because nothing else
    // is configured to sign one."
    return jwt.verify(token, env.auth.jwtAccessSecret, { algorithms: ["HS256"] }) as AccessTokenPayload;
  },

  /**
   * Raw refresh token value — sent to the client, never stored as-is.
   */
  generateRefreshTokenValue(): string {
    return randomBytes(32).toString("hex");
  },

  /**
   * SHA-256, not bcrypt: this hashes a 256-bit random value, not a
   * low-entropy password, so there's no brute-force risk to slow down —
   * a fast, deterministic hash is the correct tool for a lookup key.
   */
  hashRefreshToken(rawToken: string): string {
    return createHash("sha256").update(rawToken).digest("hex");
  },

  refreshTokenExpiryDate(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.auth.refreshTokenExpiresInDays);
    return expiresAt;
  },
};

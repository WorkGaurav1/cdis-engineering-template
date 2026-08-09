import bcrypt from "bcrypt";

import { env } from "../config/index.js";
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from "../errors/index.js";
import { toSafeUser, type SafeUser } from "../mappers/user.mapper.js";
import { refreshTokenRepository } from "../repositories/refreshToken.repository.js";
import { roleRepository } from "../repositories/role.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { tokenService } from "./token.service.js";

export type { SafeUser };

export interface AuthResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

export interface RequestContext {
  ip?: string;
  userAgent?: string;
}

async function issueTokenPair(userId: string, context: RequestContext) {
  const accessToken = tokenService.signAccessToken(userId);
  const rawRefreshToken = tokenService.generateRefreshTokenValue();

  await refreshTokenRepository.create({
    userId,
    tokenHash: tokenService.hashRefreshToken(rawRefreshToken),
    expiresAt: tokenService.refreshTokenExpiryDate(),
    createdByIp: context.ip,
    userAgent: context.userAgent,
  });

  return { accessToken, refreshToken: rawRefreshToken };
}

export const authService = {
  async register(
    input: { email: string; name: string; password: string },
    context: RequestContext,
  ): Promise<AuthResult> {
    const existing = await userRepository.findByEmail(input.email);

    if (existing) {
      throw new ConflictError("An account with this email already exists.");
    }

    const defaultRole = await roleRepository.findByName("user");

    if (!defaultRole) {
      throw new Error("Default role 'user' is missing. Run `npm run prisma:seed`.");
    }

    const passwordHash = await bcrypt.hash(input.password, env.auth.bcryptSaltRounds);
    const created = await userRepository.create({ email: input.email, name: input.name, passwordHash });
    await userRepository.assignRole(created.id, defaultRole.id);

    const user = await userRepository.findById(created.id);

    if (!user) {
      throw new Error("User record was not found immediately after creation.");
    }

    const tokens = await issueTokenPair(user.id, context);

    return { user: toSafeUser(user), ...tokens };
  },

  async login(input: { email: string; password: string }, context: RequestContext): Promise<AuthResult> {
    const user = await userRepository.findByEmail(input.email);

    // Identical error for "no such account" and "wrong password" — OWASP
    // Authentication Cheat Sheet: distinct messages let an attacker
    // enumerate valid emails.
    const invalidCredentials = (): UnauthorizedError => new UnauthorizedError("Invalid email or password.");

    if (!user) {
      throw invalidCredentials();
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenError(
        "This account is temporarily locked due to repeated failed sign-in attempts. Please try again later.",
      );
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      const attempts = user.failedLoginAttempts + 1;
      const lockedUntil =
        attempts >= env.auth.lockoutMaxAttempts
          ? new Date(Date.now() + env.auth.lockoutDurationMinutes * 60_000)
          : null;

      await userRepository.recordFailedLogin(user.id, attempts, lockedUntil);
      throw invalidCredentials();
    }

    await userRepository.resetFailedLogins(user.id);

    const tokens = await issueTokenPair(user.id, context);

    return { user: toSafeUser(user), ...tokens };
  },

  async refresh(rawToken: string, context: RequestContext): Promise<AuthResult> {
    const tokenHash = tokenService.hashRefreshToken(rawToken);
    const existing = await refreshTokenRepository.findByTokenHash(tokenHash);

    if (!existing) {
      throw new UnauthorizedError("Invalid session. Please sign in again.");
    }

    if (existing.revokedAt) {
      // Reuse of an already-rotated token: the token chain may have been
      // stolen. Kill every active session for this user as a precaution.
      await refreshTokenRepository.revokeAllForUser(existing.userId);
      throw new UnauthorizedError("This session is no longer valid. Please sign in again.");
    }

    if (existing.expiresAt < new Date()) {
      throw new UnauthorizedError("Your session has expired. Please sign in again.");
    }

    const user = await userRepository.findById(existing.userId);

    if (!user) {
      throw new UnauthorizedError("Invalid session. Please sign in again.");
    }

    const accessToken = tokenService.signAccessToken(user.id);
    const newRawRefreshToken = tokenService.generateRefreshTokenValue();

    const created = await refreshTokenRepository.create({
      userId: user.id,
      tokenHash: tokenService.hashRefreshToken(newRawRefreshToken),
      expiresAt: tokenService.refreshTokenExpiryDate(),
      createdByIp: context.ip,
      userAgent: context.userAgent,
    });

    await refreshTokenRepository.markRotated(existing.id, created.id);

    return { user: toSafeUser(user), accessToken, refreshToken: newRawRefreshToken };
  },

  async logout(rawToken: string): Promise<void> {
    const tokenHash = tokenService.hashRefreshToken(rawToken);
    const existing = await refreshTokenRepository.findByTokenHash(tokenHash);

    if (existing && !existing.revokedAt) {
      await refreshTokenRepository.revoke(existing.id);
    }
  },

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return toSafeUser(user);
  },
};

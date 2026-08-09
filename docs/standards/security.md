# Security Standards

What's actually implemented, mapped to the OWASP guidance it follows.

---

## Purpose

The security controls in place today, and where to find/modify each one.

---

## Location

| Control | File |
|---|---|
| Security headers | `back-end/src/app.ts` (`helmet()`) |
| CORS | `back-end/src/app.ts` (locked to `CORS_ORIGIN`, `credentials: true`) |
| Rate limiting (global + login) | `back-end/src/app.ts`, `back-end/src/middlewares/rateLimiters.ts` |
| CSRF (double-submit cookie) | `back-end/src/middlewares/csrf.ts` |
| Password hashing | `back-end/src/services/auth.service.ts` (bcrypt, cost from `BCRYPT_SALT_ROUNDS`) |
| Account lockout | `back-end/src/services/auth.service.ts` |
| Session tokens | `back-end/src/lib/cookies.ts`, `services/token.service.ts` — see [Authentication](../architecture/authentication.md) |
| Authorization | `back-end/src/middlewares/requirePermission.ts` — see [Authorization](../architecture/authorization.md) |
| Input validation | `back-end/src/middlewares/validate.ts` + Zod schemas in `dto/` |
| Response sanitization | `back-end/src/mappers/user.mapper.ts` (`toSafeUser` strips `passwordHash`) |

---

## Workflow

- **Cookies**: `access_token`/`refresh_token` are httpOnly (invisible to JS); `csrf_token` deliberately is not — the double-submit pattern needs JS to read it and echo it as the `x-csrf-token` header. All three are `sameSite: "lax"`, `secure` in production only.
- **CSRF** is only checked on authenticated, state-changing routes (`/auth/refresh`, `/auth/logout`) — login/register have no prior session to ride.
- **Login enumeration**: "no such user" and "wrong password" return the identical `401` message.
- **Refresh token reuse detection**: presenting an already-rotated refresh token revokes every session for that user (see [Authentication](../architecture/authentication.md)).
- **Authorization always checks permission keys, never role names** in guards (see [Authorization](../architecture/authorization.md)).

---

## Common Tasks

| Task | File |
|---|---|
| Add a rate limiter to a new route | follow the pattern in `rateLimiters.ts`, apply as route middleware |
| Add validation to a new endpoint | Zod schema in `dto/`, `validateBody(schema)` in the route |
| Strip sensitive fields from a response | add/extend a mapper in `mappers/` |
| Change password/lockout policy | `.env` — see [Environment Standards](environment.md) |

---

## Related Documents

- [Authentication](../architecture/authentication.md)
- [Authorization](../architecture/authorization.md)
- [Environment Standards](environment.md)

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

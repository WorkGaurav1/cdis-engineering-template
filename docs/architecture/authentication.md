# Authentication

JWT access tokens + rotating opaque refresh tokens, delivered as httpOnly cookies.

---

## Purpose

How this project authenticates a user, restores a session, refreshes it, and ends it.

---

## Location

| Layer | Files |
|---|---|
| Routes | `back-end/src/routes/auth.routes.ts` |
| Controller | `back-end/src/controllers/auth.controller.ts` |
| Business logic | `back-end/src/services/auth.service.ts` |
| Tokens (JWT sign/verify, refresh hash) | `back-end/src/services/token.service.ts` |
| Cookies (names, flags, `maxAge`) | `back-end/src/lib/cookies.ts` |
| Guards | `back-end/src/middlewares/{requireAuth,csrf,rateLimiters}.ts` |
| Validation | `back-end/src/dto/auth.dto.ts` |
| Data models | `back-end/prisma/schema.prisma` (`User`, `RefreshToken`) |
| Session state | `front-end/src/auth/context/AuthProvider.tsx` |
| Login form | `front-end/src/auth/hooks/useLogin.ts`, `schemas/loginSchema.ts` |
| Route guards | `front-end/src/auth/components/{RequireAuth,RedirectIfAuthenticated}.tsx` |
| Silent refresh | `front-end/src/api/client/interceptors.ts` |

No register/forgot-password **page** exists yet (`auth/pages/` has only `LoginPage.tsx`); the backend `/register` route works and is tested.

---

## Workflow

**Login**
```
LoginForm → useLogin → AuthProvider.login
  → POST /auth/login → authService.login (bcrypt compare, lockout check)
  → sets access_token, refresh_token, csrf_token cookies
  → user cached in React Query
```

**Session restore** (on app load / tab focus)
```
AuthProvider → GET /auth/me → requireAuth → 200 (user) or 401 (null, silent)
```

**Silent refresh** (on any 401)
```
axios interceptor → POST /auth/refresh (CSRF header)
  → valid: rotate token pair, retry original request
  → reused/expired token: revoke all sessions, dispatch "auth:session-expired"
```

**Logout**
```
ProfileMenu → AuthProvider.logout → POST /auth/logout → revoke token, clear cookies
```

---

## Common Tasks

| Task | File |
|---|---|
| Access token lifetime | `.env` `JWT_ACCESS_EXPIRES_IN` **and** the hardcoded `maxAge` in `cookies.ts` (not linked — update both) |
| Refresh token lifetime | `.env` `REFRESH_TOKEN_EXPIRES_IN_DAYS` |
| Password hash cost | `.env` `BCRYPT_SALT_ROUNDS` |
| Lockout policy | `.env` `ACCOUNT_LOCKOUT_MAX_ATTEMPTS` / `ACCOUNT_LOCKOUT_DURATION_MINUTES` |
| New auth endpoint | route in `auth.routes.ts` → controller → `auth.service.ts` → schema in `auth.dto.ts` |
| Add register/forgot-password UI | new page in `auth/pages/`, wire in `routes/publicRoutes.tsx` |
| Debug a session | DevTools → Cookies (`access_token`/`refresh_token` HttpOnly, `csrf_token` not); Network tab on `/auth/me`, `/auth/refresh` |

---

## Commands

```bash
curl -c cookies.txt -X POST localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" -d '{"email":"...","password":"..."}'

curl -b cookies.txt localhost:4000/api/v1/auth/me
```

---

## Related Documents

- [Authorization](authorization.md)
- [Security Standards](../standards/security.md)
- [Environment Standards](../standards/environment.md)

---

## References

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [JWT — RFC 7519](https://www.rfc-editor.org/rfc/rfc7519)

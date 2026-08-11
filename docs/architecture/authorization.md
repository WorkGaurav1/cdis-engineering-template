# Authorization

Hybrid RBAC: roles assign permissions, but every guard checks permission keys directly.

---

## Purpose

Document how authenticated users are authorized in this repository and where developers should extend permission checks.

---

## Location

| Layer | Files |
|---|---|
| Database schema | `back-end/prisma/schema.prisma` (`Role`, `Permission`, `UserRole`, `RolePermission`) |
| Seeded roles/permissions | `back-end/prisma/seed.ts` |
| Backend route guard | `back-end/src/middlewares/requirePermission.ts` |
| Example protected route | `back-end/src/routes/user.routes.ts` |
| Permission helpers | `front-end/src/auth/hooks/usePermission.ts` |
| Route guard | `front-end/src/auth/components/RequirePermission.tsx` |
| UI gate | `front-end/src/auth/components/PermissionGate.tsx` |
| User payload shape | `back-end/src/mappers/user.mapper.ts` |

---

## Workflow

**Backend authorization**

1. `requireAuth` authenticates the request and sets `req.userId`.
2. `requirePermission("users:read")` or another permission guard loads the current user from the backend via `authService.getCurrentUser(req.userId)` and caches it on `req.user`.
3. The guard checks permission keys against `req.user.permissions`.
4. If the user lacks the required permission, the request returns `403 Forbidden`.

**Frontend authorization**

1. `AuthProvider` loads the current user from `/api/v1/auth/me`.
2. `RequireAuth` protects protected route trees and redirects unauthenticated users to `/login`.
3. `RequirePermission` wraps protected feature routes and redirects unauthorized users to `/forbidden`.
4. `PermissionGate` hides or shows UI inside an already-authenticated page without blocking navigation.

---

## Common Tasks

| Task | What to change |
|---|---|
| Add a new permission | Update `PERMISSIONS` in `back-end/prisma/seed.ts`, assign it to roles, then run `npm run prisma:seed` in `back-end/` |
| Protect a new backend route | Add `requireAuth` and `requirePermission("key")` to the route in `back-end/src/routes/*.ts` |
| Protect a new frontend route | Wrap the feature route in `front-end/src/routes/protectedRoutes.tsx` with `<RequirePermission permission="key" />` |
| Conditionally render UI | Use `<PermissionGate permission="key">...</PermissionGate>` in the frontend |
| Change role permissions | Update `ROLES[...]` in `back-end/prisma/seed.ts` and re-run seeding |
| Change user payload permissions | Update `back-end/src/mappers/user.mapper.ts` and frontend `front-end/src/auth/types/auth.types.ts` |

---

## Related Documents

- [Authentication](authentication.md)
- [Security Standards](../standards/security.md)
- [Database Standards](../standards/database.md)

---

## References

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

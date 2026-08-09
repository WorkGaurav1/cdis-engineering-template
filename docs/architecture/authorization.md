# Authorization

Hybrid RBAC: roles are for assignment, permissions are what every guard actually checks.

---

## Purpose

How this project decides what an authenticated user is allowed to do.

---

## Location

| Layer | Files |
|---|---|
| Data model | `back-end/prisma/schema.prisma` (`Role`, `Permission`, `UserRole`, `RolePermission`) |
| Seed data | `back-end/prisma/seed.ts` |
| Route guard | `back-end/src/middlewares/requirePermission.ts` |
| Example usage | `back-end/src/routes/user.routes.ts` |
| Frontend check (hook + plain fn) | `front-end/src/auth/hooks/usePermission.ts` |
| Frontend route guard | `front-end/src/auth/components/RequirePermission.tsx` |
| Frontend inline UI guard | `front-end/src/auth/components/PermissionGate.tsx` |

---

## Workflow

**Seeded roles → permissions** (`seed.ts`)
```
admin    → users:read, users:write, roles:manage
manager  → users:read
user     → (none)
```

**Backend check**
```
route → requireAuth (who) → requirePermission("users:read") (what)
  → loads req.user.permissions once per request, caches on req.user
  → 403 if none of the required permissions are present
```

**Frontend checks** — three ways to use the same `hasPermission(user, permission)` logic:
```
usePermission("users:read")        → boolean, for conditional logic in a component
<RequirePermission permission=.. />  → route guard, redirects to /forbidden
<PermissionGate permission=.. />     → hides/shows a piece of UI, no navigation blocked
```

Guards always check **permission keys** (`"users:read"`), never role names — a role is only ever used to assign permissions, never checked directly in a guard.

---

## Common Tasks

| Task | File |
|---|---|
| Add a new permission | add to `PERMISSIONS` in `seed.ts`, assign to a role, run `npm run prisma:seed` |
| Protect a new backend route | `requireAuth, requirePermission("key")` in its route file |
| Protect a new frontend route | wrap it with `<RequirePermission permission="key" />` in `routes/protectedRoutes.tsx` |
| Hide a nav item / button | `<PermissionGate permission="key">` |
| Change what a role grants | edit `ROLES[...].permissions` in `seed.ts`, re-seed |

---

## Related Documents

- [Authentication](authentication.md)
- [Security Standards](../standards/security.md)
- [Database Standards](../standards/database.md)

---

## References

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

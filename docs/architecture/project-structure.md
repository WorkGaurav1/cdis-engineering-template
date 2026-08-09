# Project Structure

The actual on-disk layout of both apps — not a planned/aspirational one.

---

## Purpose

Where code lives today, so new code goes to the same place.

---

## Location


.
├── front-end/
├── back-end/
├── docs/
├── docker-compose.yml   # MySQL dev container only
└── README.md




---

## Workflow

**`front-end/src/`** — feature-folder frontend, layered backend counterpart on the API side.

| Dir | Purpose |
|---|---|
| `api/` | axios client, interceptors (CSRF + silent refresh), typed error |
| `app/` | providers (React Query, Auth), shell (Sidebar, Navbar, AppShell) |
| `assets/` | exists, currently empty — static files (e.g. the logo) are served from `public/` instead |
| `auth/` | the whole auth module — see `authentication.md` |
| `config/` | env/app config (mirrors the backend's fail-fast pattern) |
| `features/` | one folder per pluggable feature: `charts/ dashboard/ graphs/ tables/ users/` |
| `layouts/` | `PublicLayout`, `ProtectedLayout` |
| `routes/` | `routeConfig.ts` (path constants), `publicRoutes.tsx`, `protectedRoutes.tsx` |
| `shared/` | `components/`, `hooks/`, `utils/`, `types/`, `validations/` reused across features |
| `styles/` | `globals.css` (Tailwind + theme tokens) |

A feature folder (e.g. `features/users/`) looks like:
```
users/
├── api/userApi.ts          # own fetch calls — never imports another feature's api/
├── pages/UsersPage.tsx
├── users.module.tsx        # FeatureModule: route + nav label/icon/permission
└── index.ts                 # barrel export
```

**`back-end/src/`** — layered (controller → service → repository), not domain-folder.

| Dir | Purpose |
|---|---|
| `config/` | fail-fast env loading (`env.ts`) |
| `controllers/` | HTTP layer: read req, call service, shape response |
| `dto/` | Zod request-validation schemas |
| `errors/` | typed error classes (`UnauthorizedError`, etc.) → mapped by `errorHandler` |
| `lib/` | `prisma.ts`, `logger.ts`, `cookies.ts` |
| `mappers/` | e.g. `toSafeUser` (strip `passwordHash` before it ever reaches a response) |
| `middlewares/` | `requireAuth`, `requirePermission`, `csrf`, `validate`, `rateLimiters`, error/404 handlers |
| `repositories/` | all Prisma queries live here — services never call `prisma` directly |
| `routes/` | one file per resource, mounted in `routes/index.ts` |
| `services/` | business logic |
| `test-utils/` | shared test helpers (Express req/res mocks) |
| `prisma/` | `schema.prisma`, `migrations/`, `seed.ts` |

---

## Common Tasks

| If you are adding... | Location |
|---|---|
| New frontend feature | `front-end/src/features/<name>/`, register its module in `routes/protectedRoutes.tsx` + `config/navigation/navigationConfig.ts` |
| Reusable UI component | `front-end/src/shared/components/` |
| New backend resource | new files across `controllers/ services/ repositories/ routes/ dto/`, following an existing one (e.g. `user.*`) |
| Database model | `back-end/prisma/schema.prisma`, then `npm run prisma:migrate` |
| New doc | `docs/{architecture,standards,development}/` |

---

## Related Documents

- [System Design](system-design.md)
- [Authentication](authentication.md)
- [Adding a Feature](../development/adding-feature.md)
- [Adding a Module](../development/adding-module.md)

---

## References

- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)

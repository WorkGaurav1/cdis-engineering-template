# Project Structure

The actual on-disk layout of this repository and where new code belongs.

---

## Purpose

Show developers the real structure of both the frontend and backend, not a hypothetical one.

---

## Location

Root layout:

```
front-end/
back-end/
docs/
docker-compose.yml
README.md
```

---

## Workflow

**Front-end (`front-end/src/`)**

| Dir | Purpose |
|---|---|
| `api/` | HTTP client, typed API layer, interceptors for auth/session behavior |
| `app/` | App providers, shell, layout composition |
| `assets/` | static assets (fonts, icons, images, SVG) |
| `auth/` | authentication module: pages, forms, route guards, hooks, API calls |
| `config/` | runtime app config and environment mapping |
| `features/` | feature modules for dashboard, charts, graphs, tables, users |
| `layouts/` | public and protected route layouts |
| `routes/` | route definitions and route composition |
| `shared/` | reusable components, hooks, utils, validations, types |
| `styles/` | global CSS, theme variables |

A feature module looks like:

```
features/<feature>/
  api/
  components/
  hooks/
  pages/
  types/
  <feature>.module.tsx
  index.ts
```

**Back-end (`back-end/src/`)**

| Dir | Purpose |
|---|---|
| `config/` | validated environment config (`env.ts`) |
| `controllers/` | HTTP handlers, request/response mapping |
| `dto/` | Zod request validation schemas |
| `errors/` | application error classes and typed error handling |
| `lib/` | Prisma client, cookie helpers, logger |
| `mappers/` | response-safe data mapping, e.g. `toSafeUser` |
| `middlewares/` | auth, permission, CSRF, validation, rate limiting, 404/error handlers |
| `repositories/` | Prisma queries and persistence logic |
| `routes/` | route registration and route files |
| `services/` | business logic, token/session rules, auth workflows |
| `test-utils/` | shared backend test helpers |
| `prisma/` | schema, migrations, seed data |

---

## Common Tasks

| Task | Location |
|---|---|
| Add a frontend feature | `front-end/src/features/<name>/`, register in `front-end/src/routes/protectedRoutes.tsx` and `front-end/src/config/navigation/navigationConfig.ts` |
| Add a shared component | `front-end/src/shared/components/` |
| Add a backend resource | new `controller`, `service`, `repository`, `route`, `dto` files in `back-end/src/` |
| Add a database model | `back-end/prisma/schema.prisma`, then `cd back-end && npm run prisma:migrate` |
| Add architecture docs | `docs/architecture/` |
| Add standards docs | `docs/standards/` |
| Add development workflow docs | `docs/development/` |

---

## Related Documents

- [System Design](system-design.md)
- [Authentication](authentication.md)
- [Authorization](authorization.md)
- [Adding a Feature](../development/adding-feature.md)
- [Adding a Module](../development/adding-module.md)

---

## References

- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)

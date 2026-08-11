# System Design

How the frontend, backend, database, and auth/session layers are wired together in this repository.

---

## Purpose

Capture the actual runtime architecture and integration points for this project.

---

## Location

| Piece | Path | Dev port |
|---|---|---|
| Frontend SPA | `front-end/` | `5173` |
| Backend API | `back-end/` | `4000` |
| Database | `docker-compose.yml` | container `3306` |
| Versioned API router | `back-end/src/routes/index.ts` | mounted at `/api/v1` |
| Health router | `back-end/src/routes/health.routes.ts` | mounted at `/health` |

---

## Workflow

```
Browser (React SPA) :5173
  ↓ axios / withCredentials
Frontend API client  (front-end/src/api/client/httpClient.ts)
  ↓ /api/v1 routes
Backend Express app   (back-end/src/app.ts)
  ↓ middleware pipeline
Prisma repository layer (back-end/src/repositories)
  ↓ MariaDB / MySQL
Database container      (docker-compose.yml)
```

- The frontend runs as a Vite development server and communicates with the backend via REST.
- The backend is a standalone Express app with a versioned API under `/api/v1`.
- Health checks live outside API versioning at `/health`.
- MySQL is intended for local development via `docker compose` and the repository uses Prisma with the MariaDB adapter.

---

## Request flow

1. Browser request starts in the frontend.
2. Requests use `axios` with `withCredentials: true`.
3. If the request is authenticated, cookies are sent automatically by the browser.
4. The backend applies middleware in this order:
   - `helmet()`
   - `cors()` with credentials enabled
   - `compression()`
   - `cookieParser()`
   - `express.json()`
   - `pino-http`
   - global rate limiter
   - route dispatch under `/health` or `/api/v1`
   - 404 handler
   - error handler
5. Controllers call services, services call repositories, repositories call Prisma.
6. Responses are normal JSON envelopes and HTTP status codes.

---

## Session and auth design

- Authentication is cookie-based using `access_token`, `refresh_token`, and `csrf_token`.
- `access_token` is a JWT valid for a short period.
- `refresh_token` is an opaque random value stored hashed in the database.
- `csrf_token` is readable by frontend JS and used for double-submit CSRF protection.
- `requireAuth` validates the JWT and attaches `req.userId`.
- `requirePermission` loads the current user and checks permission keys.

---

## Why this shape

- Separate frontend/backend apps make the template reusable for independent deployment.
- Explicit API versioning keeps expansion safe as routes are added.
- Cookie-based auth with credentialed CORS matches the current backend session design.
- The backend is layered, not fully domain-driven, which keeps data access paths obvious for new engineers.

---

## Common Tasks

| Task | Where |
|---|---|
| Add a new API versioned route | `back-end/src/routes/index.ts` |
| Add a new backend resource | `back-end/src/controllers/`, `back-end/src/services/`, `back-end/src/repositories/`, `back-end/src/dto/` |
| Add a new frontend feature | `front-end/src/features/` + register module in `front-end/src/routes/protectedRoutes.tsx` + nav in `front-end/src/config/navigation/navigationConfig.ts` |
| Change the default API base URL | `front-end/src/config/appConfig.ts` |
| Change CORS policy | `back-end/src/app.ts` and `.env` `CORS_ORIGIN` |
| Seed or reset database | `cd back-end && npm run prisma:seed` |

---

## Commands

```bash
docker compose up -d mysql
cd back-end && npm install
cd front-end && npm install
cd back-end && npm run dev
cd front-end && npm run dev
```

---

## Related Documents

- [Project Structure](project-structure.md)
- [Authentication](authentication.md)
- [API Standards](../standards/api.md)
- [Docker Standards](../standards/docker.md)

---

## References

- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)

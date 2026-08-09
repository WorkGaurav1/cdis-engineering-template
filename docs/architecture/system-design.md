# System Design

Two independently-deployed apps (no shared workspace) talking over a REST API, backed by MySQL.

---

## Purpose

The high-level shape of the system — what talks to what, and where each piece runs.

---

## Location

| Piece | Path | Dev port |
|---|---|---|
| Frontend (React + Vite SPA) | `front-end/` | 5173 |
| Backend (Express API) | `back-end/` | 4000 |
| Database (MySQL 8, Docker) | `docker-compose.yml` | 3308 → container's 3306 |

---

## Workflow

```
Browser (SPA, :5173)
  ↓ fetch/axios, credentials included
Express app  (back-end/src/app.ts), mounted at /api/v1
  ↓ middleware order: helmet → cors(credentials) → compression →
    cookie-parser → json body → pino-http → global rate limit →
    /health, /api/v1 routers → 404 handler → error handler
  ↓ controller → service → repository
Prisma (mariadb driver adapter)
  ↓
MySQL 8 (Docker, dev only)
```

- CORS is locked to a single origin (`CORS_ORIGIN` env var) with `credentials: true` — required because auth is httpOnly-cookie based, not bearer-token based.
- `/health` is unauthenticated and unversioned; all product routes live under `/api/v1`.
- Graceful shutdown (`server.ts`) drains in-flight requests and disconnects Prisma on `SIGTERM`/`SIGINT`.

---

## Common Tasks

| Task | Where |
|---|---|
| Add a new top-level route group | register in `back-end/src/routes/index.js` (mounted under `/api/v1`) |
| Change the CORS origin | `.env` `CORS_ORIGIN` |
| Change global rate limit | `app.ts` (baseline limiter, not the per-route ones in `security.md`) |
| Trace a request | `pino-http` logs each request; see `back-end/src/lib/logger.ts` |

---

## Commands

```bash
docker compose up -d mysql   # from repo root
cd back-end && npm run dev   # :4000
cd front-end && npm run dev  # :5173
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

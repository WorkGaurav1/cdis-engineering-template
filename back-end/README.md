# CDIS Backend

Node.js + Express + TypeScript API backing the CDIS Engineering Template, using MySQL via Prisma ORM.

This repository was split out of the original `cdis-engineering-template` monorepo. The frontend lives in a sibling repository, [`cdis-frontend`](https://github.com/WorkGaurav1/cdis-frontend); production deployment topology lives in [`cdis-deployment`](https://github.com/WorkGaurav1/cdis-deployment).

---

## Technology Stack

- Node.js + Express 5
- TypeScript (strict mode)
- MySQL via Prisma ORM (`@prisma/adapter-mariadb`)
- JWT authentication (httpOnly cookies, rotating refresh tokens)
- Zod validation
- Vitest (unit + integration)
- Pino structured logging

---

## Project Structure

```text
src/
├── config/                  environment loading/validation
├── controllers/              HTTP-layer request/response translation
├── data-transfer-object/     Zod request-body schemas
├── errors/                   AppError + typed subclasses (401/403/404/409/...)
├── lib/                      cookies, logger, prisma client singleton
├── mappers/                  DB-shape -> API-safe-shape transforms
├── middlewares/               requireAuth, requirePermission, csrf, validate, rate limiters
├── repositories/              all direct Prisma access, one per model
├── routes/                    Express routers
├── services/                  business logic
├── test-utils/                shared test mocks (Express req/res)
├── types/                     ambient type declarations
├── utils/                     apiResponse envelope helpers
├── app.ts                     createApp() — Express app assembly
└── server.ts                  process entrypoint, graceful shutdown

prisma/
├── schema.prisma
├── migrations/
└── seed.ts                    roles/permissions + demo data (idempotent)
```

---

## Prerequisites

- Node.js 20+ (22+ recommended — some dependencies request it)
- A running MySQL 8.0 instance (see [Database](#database) below)

---

## Install

```bash
npm install
cp .env.example .env   # then fill in real values — see below
npx prisma generate
```

### Environment variables

| Variable | Notes |
|---|---|
| `NODE_ENV` | `development` \| `test` \| `production` |
| `PORT` | defaults to `4000` |
| `CORS_ORIGIN` | must exactly match the frontend's origin |
| `DATABASE_URL` | `mysql://user:pass@host:port/db` |
| `JWT_ACCESS_SECRET` | long random value — never reuse the `.env.example` placeholder |
| `JWT_ACCESS_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN_DAYS` | token lifetimes |
| `BCRYPT_SALT_ROUNDS` | password hashing cost |
| `ACCOUNT_LOCKOUT_MAX_ATTEMPTS`, `ACCOUNT_LOCKOUT_DURATION_MINUTES` | login lockout policy |

---

## Database

This repo doesn't bundle a database — point `DATABASE_URL` at any reachable MySQL 8.0 instance. For local development, the sibling `cdis-deployment` repo's compose file is one option; any local MySQL install works too.

```bash
npx prisma migrate deploy   # apply migrations
npx prisma db seed          # roles/permissions + demo data (idempotent, safe to re-run)
```

---

## Development

```bash
npm run dev     # tsx watch, auto-restarts on change
npm run start   # single run, no watch (what production/containers use)
```

---

## Testing

Two independent suites — see `docs` in the original template repo for the full testing philosophy, or the summary here:

```bash
npm test                  # unit tests — mocked, no real DB (fast)
npm run test:integration  # real MySQL, dedicated *_test database
npm run test:all          # both
npm run test:coverage     # unit tests with coverage enforcement
```

Coverage thresholds are enforced in `vitest.config.ts`: an 85%/80% global floor, with a 95%/90% bar on security-critical files (`auth.service.ts`, `token.service.ts`, `requireAuth.ts`, `requirePermission.ts`, `csrf.ts`, `cookies.ts`).

---

## Build / Type-check

There's no compiled artifact — `npm run build` runs `tsc --noEmit` as a type-check gate. Production runs TypeScript source directly via `tsx` (see `start` above), same as development.

---

## Lint

```bash
npm run lint
```

---

## Architecture notes

- **Layering**: routes → middlewares → controllers → services → repositories → Prisma. Controllers are deliberately thin — no business logic, no direct Prisma access. See the layering discussion in this repo's git history / the original template's docs for the full rationale.
- **Auth**: httpOnly, `sameSite: "lax"` cookies for access/refresh tokens; a separate readable cookie for CSRF (double-submit pattern). Refresh tokens rotate on use; reuse of an already-rotated token revokes every session for that user.
- **Errors**: every thrown error is either an `AppError` subclass (real message shown to the client) or gets converted to a generic 500 (internal errors never leak details) — see `middlewares/errorHandler.ts`.

---

## References

- Node.js — https://nodejs.org
- Express — https://expressjs.com
- TypeScript — https://www.typescriptlang.org
- Prisma — https://www.prisma.io/docs
- MySQL — https://dev.mysql.com/doc/
- Zod — https://zod.dev
- Vitest — https://vitest.dev

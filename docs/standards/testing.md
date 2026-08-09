# Testing Standards

Vitest for both apps. Coverage thresholds are configured but **not currently met globally** — only specific security-critical files have real coverage today.

---

## Purpose

How tests are organized, run, and gated in this project.

---

## Location

| Piece | File |
|---|---|
| Backend unit config | `back-end/vitest.config.ts` |
| Backend integration config | `back-end/vitest.integration.config.ts` |
| Frontend config | `front-end/vitest.config.ts`, `front-end/vitest.setup.ts` |
| Backend test helpers | `back-end/src/test-utils/` (Express req/res mocks) |

No Playwright/E2E config exists in the repo — end-to-end verification during development has been manual, not committed test code.

---

## Workflow

**Backend** — two separate configs:
```
npm run test              → *.test.ts        (unit, mocked, no real DB)
npm run test:integration  → *.integration.test.ts  (real MySQL, dedicated cdis_test DB, no file parallelism)
npm run test:all          → both
```
Unit tests set a lower `BCRYPT_SALT_ROUNDS=4` — cost doesn't affect correctness, only brute-force resistance, so this keeps hundreds of hash calls fast.

**Frontend** — Vitest + React Testing Library + jsdom, one config, `npm run test`.

**Coverage** — both configs set a global floor (**85% lines/statements/functions, 80% branches**) and a higher bar (**95%/90%**) on specific security-critical files:
```
back-end:  auth.service.ts, token.service.ts, requireAuth.ts,
           requirePermission.ts, csrf.ts, cookies.ts
front-end: usePermission.ts, RequireAuth.tsx, RequirePermission.tsx,
           interceptors.ts
```
Those specific files are actually tested to that bar today. Most other code (all of `front-end/src/features/`, most repositories/controllers) has **no tests yet** — running `npm run test:coverage` against the whole codebase will not currently pass the global threshold.

---

## Common Tasks

| Task | Command |
|---|---|
| Run backend unit tests | `cd back-end && npm run test` |
| Run backend integration tests (needs `docker compose up -d mysql`) | `npm run test:integration` |
| Run frontend tests | `cd front-end && npm run test` |
| Check coverage | `npm run test:coverage` in either app |
| Add a security-critical file's threshold | add its path to the `coverage.thresholds` object in the relevant `vitest.config.ts` |

---

## Related Documents

- [Code Style](code-style.md)
- [Authentication](../architecture/authentication.md)

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)

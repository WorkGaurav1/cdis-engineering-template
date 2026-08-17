# Testing Standards

Vitest for both apps, Playwright for E2E. Coverage thresholds are configured and **met globally on both apps**, including every security-critical file.

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
| E2E config | `playwright.config.ts` (repo root) |
| E2E specs + helpers | `e2e/` (repo root) |
| CI workflow | `.github/workflows/ci.yml` |

E2E drives the real front-end (built, served via `vite preview`) against the real back-end and a real MySQL database — not the dev server, not mocked. `playwright.config.ts`'s `webServer` entries start both app processes; MySQL must already be running (`docker compose up -d mysql`), same prerequisite as the backend's integration tests.

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

**E2E** — Playwright, run from the repo root: `npm run test:e2e`. Covers the login/logout flow, session persistence across a reload, sidebar/account-menu navigation to every page, the permission-gated redirect to `/forbidden`, and the catch-all 404. Deliberately a baseline suite (one representative path per page), not exhaustive — Vitest component tests cover the deeper per-page behavior.

**Coverage** — both configs set a global floor (**85% lines/statements/functions, 80% branches**) and a higher bar (**95%/90%**) on specific security-critical files:
```
back-end:  auth.service.ts, token.service.ts, requireAuth.ts,
           requirePermission.ts, csrf.ts, cookies.ts
front-end: usePermission.ts, RequireAuth.tsx, RequirePermission.tsx,
           interceptors.ts
```
Both the global floor and every security-critical file's higher bar are met today, on both apps — `npm run test:coverage` passes cleanly in `back-end/` and `front-end/`. A few presentational/bootstrap files sit meaningfully below the floor on their own (`GeoMap.tsx`, `DashboardPage.tsx`, `LoginForm.tsx`) — real Leaflet interaction is unstable to simulate in jsdom (simulated clicks can trigger Leaflet's internal double-click detection against a zero-size layout and throw), so those lean on the E2E suite and the manual browser verification each covers instead of deeper unit coverage. The global aggregate absorbs this with room to spare.

---

## Common Tasks

| Task | Command |
|---|---|
| Run backend unit tests | `cd back-end && npm run test` |
| Run backend integration tests (needs `docker compose up -d mysql`) | `npm run test:integration` |
| Run frontend tests | `cd front-end && npm run test` |
| Run E2E tests (needs `docker compose up -d mysql`) | from repo root: `npm run test:e2e` |
| Check coverage | `npm run test:coverage` in either app |
| Add a security-critical file's threshold | add its path to the `coverage.thresholds` object in the relevant `vitest.config.ts` |
| Change what CI runs | edit `.github/workflows/ci.yml` — see [Release Process](../development/release.md) for the locked stage order |

---

## Related Documents

- [Code Style](code-style.md)
- [Authentication](../architecture/authentication.md)

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)

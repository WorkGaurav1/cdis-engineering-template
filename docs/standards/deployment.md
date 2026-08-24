# Deployment Standards

A real CI/CD pipeline exists: both apps build, test, and publish versioned Docker images on every merge to `main`; `deployment/` pulls and runs them. This describes what's actually implemented and what's still pending a live server.

---

## Purpose

The path from a merge to `main` to a running container, and what still requires manual action today.

---

## Location

| Piece | File |
|---|---|
| Frontend CI | `.github/workflows/ci.yml` (this repo, root) — lint → type-check → tests → coverage → build, then builds/pushes the frontend image on `main` |
| Backend CI | same workflow — lint → type-check → tests (unit+integration) → coverage → `npm audit`, then builds/pushes the backend image on `main` |
| Image registry | GHCR — `ghcr.io/workgaurav1/cdis-frontend`, `ghcr.io/workgaurav1/cdis-backend`, tagged by commit SHA (never only `latest` in production) |
| Deploy/rollback/health-check | `deployment/scripts/deploy.sh`, `rollback.sh`, `health-check.sh` |
| HTTPS bootstrap | `deployment/scripts/setup-https.sh` |
| CD trigger | fires from each app's CI after a successful image push; consumed by a deploy workflow that resolves both image versions and runs `deploy.sh` on a self-hosted runner |

---

## Workflow

**Build**: both apps build multi-platform (amd64 + arm64) images via Docker Buildx, since the eventual server's CPU architecture isn't fixed in advance. Images are tagged by commit SHA and pushed to GHCR — build once, deploy the pulled artifact everywhere else; the deploy side never rebuilds from source.

**Deploy**: `deploy.sh <frontend-version> <backend-version>` pulls the named versions, records what was previously running (for rollback), brings the stack up, and polls `/health` before declaring success. On failure it exits non-zero rather than leaving a silently broken deploy running, and points at `rollback.sh`.

**Rollback**: `rollback.sh` re-deploys whatever was live immediately before the last `deploy.sh` run — no separate rollback logic, it's the same deploy path pointed backward.

**HTTPS**: `setup-https.sh` obtains a Let's Encrypt certificate via the webroot method (Docker-native `certbot`, no host-installed certbot) and switches the Apache reverse proxy from HTTP-only to TLS. Needs a publicly-reachable domain to actually run.

---

## What's real vs. what's still pending

| Piece | Status |
|---|---|
| CI (lint/type-check/tests/coverage/security/build) | Real, runs on every push, verified green |
| Image publishing to GHCR | Real, verified — images are genuinely pullable |
| `deploy.sh`/`rollback.sh`/`health-check.sh` | Real, exercised through a genuine two-version deploy→rollback cycle locally |
| Local + production Compose stacks, Apache reverse proxy | Real, verified end-to-end (real login round-trip, full E2E suite passing against both the local build and pulled GHCR images) |
| HTTPS scripts/configs | Written and syntax-verified; real Let's Encrypt issuance not yet exercised — needs a live public domain |
| Automated CD trigger | Wired but not yet verified against a real self-hosted runner — no production server exists yet |
| Production server | Does not exist yet |

---

## Common Tasks

| Task | Command |
|---|---|
| Deploy a specific version pair | `./deployment/scripts/deploy.sh <frontend-sha> <backend-sha>` |
| Roll back to the previous version | `./deployment/scripts/rollback.sh` |
| Check a running environment's health | `./deployment/scripts/health-check.sh [base-url]` |
| Bring up HTTPS for the first time | `./deployment/scripts/setup-https.sh <domain> <email>` |

---

## Related Documents

- [Docker Standards](docker.md)
- [Environment Standards](environment.md)
- [Release Process](../development/release.md)

---

## References

- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

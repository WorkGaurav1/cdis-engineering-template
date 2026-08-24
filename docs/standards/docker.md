# Docker Standards

Both apps have real, multi-stage Dockerfiles, and `deployment/compose/` is the actual local-through-production Compose model. This file describes what exists now — for the CI/CD pipeline that builds and publishes these images, see [Deployment Standards](deployment.md).

---

## Purpose

Where each app's Dockerfile lives, what it produces, and how the Compose stacks in `deployment/` use them.

---

## Location

| Piece | File |
|---|---|
| Frontend image | `front-end/Dockerfile` — multi-stage: `node:22-alpine` build → `nginx:1.29-alpine` runtime, non-root |
| Backend image | `back-end/Dockerfile` — multi-stage: `node:22-alpine` deps/prod-deps → `node:22-alpine` runtime, non-root, runs TS source directly via `tsx` (no compiled artifact) |
| Local dev compose | `deployment/compose/compose.yaml` — builds both images from source (`front-end/`, `back-end/`), for local end-to-end verification |
| Production compose | `deployment/compose/compose.production.yaml` — pulls pinned GHCR images by commit SHA, never `:latest` |
| HTTPS overlays | `deployment/compose/compose.https-init.yaml`, `compose.https.yaml` — bootstrap and steady-state TLS, layered on top of the production compose file |
| Reverse proxy | `deployment/reverse-proxy/apache/httpd.conf`, `httpd.tls.conf.template` — Apache httpd, single public origin fronting both containers |

---

## Workflow

**Frontend image**: `node:22-alpine` installs deps and runs `vite build` with real production `VITE_*` build args (`VITE_API_BASE_URL=/api/v1`, a relative path — the reverse proxy makes this work regardless of the deployed origin). The runtime stage copies the static build into an `nginx:1.29-alpine` image, runs as the non-root `nginx` user (via `setcap cap_net_bind_service` so it can still bind port 80 unprivileged), and exposes `/health`.

**Backend image**: `node:22-alpine` installs full deps for `prisma generate`, then a second `prod-deps` stage installs only production dependencies, then the runtime stage copies both the generated Prisma client and the TypeScript source and runs it directly via `tsx` — there is still no compiled `dist/`, `tsx` is a real runtime dependency in production, not a dev tool. Runs as a non-root `app` user, `HEALTHCHECK` hits `/health`.

**Local verification**: `deployment/compose/compose.yaml` builds both images from the sibling `front-end/`/`back-end/` source and wires them behind Apache on `localhost:8080` — this is how the whole stack gets exercised end-to-end before anything is pushed.

**Production**: `deployment/compose/compose.production.yaml` never builds from source — it pulls `ghcr.io/workgaurav1/cdis-frontend:<sha>` / `cdis-backend:<sha>`, published by each app's own CI (see [Deployment Standards](deployment.md)). `FRONTEND_VERSION`/`BACKEND_VERSION` are required, with no default — an unset or `:latest`-pointed deploy fails loudly rather than silently running whatever was last pushed.

---

## Common Tasks

| Task | Command |
|---|---|
| Build the frontend image locally | `docker build -t cdis-frontend --build-arg VITE_API_BASE_URL=/api/v1 front-end/` |
| Build the backend image locally | `docker build -t cdis-backend back-end/` |
| Bring up the full local stack | `docker compose -f deployment/compose/compose.yaml up -d --build` |
| Bring up the production-model stack (pulled images) | `docker compose -f deployment/compose/compose.production.yaml --env-file deployment/compose/.env.production up -d` |
| Add HTTPS locally/in production | see `deployment/scripts/setup-https.sh` and [Deployment Standards](deployment.md) |

---

## Related Documents

- [Deployment Standards](deployment.md)
- [Environment Standards](environment.md)
- [Database Standards](database.md)

---

## References

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Official Image](https://hub.docker.com/_/mysql)

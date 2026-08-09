# Deployment Standards

**No deployment pipeline exists yet.** This documents what running each app "for production" currently means — manually — not an established process.

---

## Purpose

What `build`/`start` actually produce today, so deployment can be added on top of real behavior instead of assumptions.

---

## Location

| Piece | File |
|---|---|
| Frontend build | `front-end/package.json` → `build`: `tsc -b && vite build` → `front-end/dist/` |
| Backend "build" | `back-end/package.json` → `build`: `tsc --noEmit` (type-check only — **no JS is emitted**) |
| Backend start | `back-end/package.json` → `start`: `tsx --env-file=.env src/server.ts` |

---

## Workflow

**Frontend** produces a real static bundle:
```
npm run build → front-end/dist/  (static HTML/JS/CSS, served by any static host/CDN)
```

**Backend has no compiled artifact.** `tsx` executes the TypeScript source directly in every environment, including `start` — there is no `dist/` for the backend. Whatever runs the process in production still needs the TypeScript source and `tsx` installed, not a compiled `node dist/server.js`.

Neither app has: a Dockerfile, a CI/CD workflow, a hosting/target-environment config, or a process manager config (pm2, systemd unit, etc.). The root `README.md`'s own "Future improvements" section lists Dockerfiles, CI/CD, and production deployment docs as not-yet-done — this file reflects that same state.

---

## Common Tasks

| Task | Current reality |
|---|---|
| Deploy the frontend | build `dist/`, serve it statically — no existing script/target does this |
| Deploy the backend | run `tsx --env-file=.env src/server.ts` on the target with production env vars set — no process manager or container wraps this today |
| Add real deployment | start with a backend Dockerfile (see [Docker Standards](docker.md) for what already exists) and a CI workflow that runs the checks in [Testing Standards](testing.md) before deploying |

---

## Related Documents

- [Docker Standards](docker.md)
- [Environment Standards](environment.md)
- [Release Process](../development/release.md)

---

## References

- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

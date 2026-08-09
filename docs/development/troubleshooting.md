# Troubleshooting

Real issues encountered building this repo, not generic advice.

---

## Purpose

Fast lookup for recurring problems and their actual fix in this codebase.

---

## Workflow

| Symptom | Cause | Fix |
|---|---|---|
| Backend throws `[Configuration Error] Missing required environment variable` on startup | `.env` missing or incomplete | `cp back-end/.env.example back-end/.env` and fill it in — see [Environment Standards](../standards/environment.md) |
| `Cannot find module '../../generated/prisma'` | Prisma client is generated, not committed | `cd back-end && npm run prisma:generate` |
| Backend can't connect to the database | MySQL container not running, or wrong port | `docker compose up -d mysql`; confirm `DATABASE_URL` targets `localhost:3308` (not 3306) |
| A custom `tsx`/`node` command ignores your `.env` values | Missing the `--env-file=.env` flag | Every existing script already has it (`package.json`) — copy that pattern for new ones |
| `403 Missing or invalid CSRF token` on `/auth/refresh` or `/auth/logout` | `x-csrf-token` header wasn't sent, or doesn't match the `csrf_token` cookie | Read the cookie client-side and echo its exact value as the header — see [Authentication](../architecture/authentication.md) |
| Logged in, but `/auth/me` or `/auth/refresh` returns 401 right after | `refresh_token` cookie is scoped to path `/api/v1/auth` — it won't be sent to other paths or a different base URL | Confirm the request actually hits `/api/v1/auth/...` |
| Leaflet markers render as a broken image icon | Known Leaflet + bundler issue — default marker icon paths resolve relative to Leaflet's own JS, not the app | Already fixed via `shared/components/Map/leafletIconFix.ts` — any new map code must import it (see `GeoMap.tsx`) |
| `fitBounds()` on a map looks badly zoomed out despite correct bounds | Leaflet's default `zoomSnap: 1` can't land on a fractional "true fit" zoom | `GeoMap` sets `zoomSnap={0.25}` — keep this if building another map component |
| ESLint/React Compiler error `react-hooks/set-state-in-effect` | Calling `setState` synchronously inside a bare `useEffect` body | Move the state update into the event handler that triggers it, or derive the value during render instead |
| `tsc` reports errors that don't match the current file contents | Stale incremental build cache | `npx tsc -b --force` |
| Docker can't see `/media/...` project files (Linux, snap-installed Docker) | snap confinement blocks removable-media access | `sudo snap connect docker:removable-media` |

---

## Related Documents

- [Authentication](../architecture/authentication.md)
- [Environment Standards](../standards/environment.md)
- [Docker Standards](../standards/docker.md)

---

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Leaflet Documentation](https://leafletjs.com/reference.html)

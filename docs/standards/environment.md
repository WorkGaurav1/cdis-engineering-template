# Environment Standards

Both apps fail fast on missing/invalid config — no silent fallback to `undefined`.

---

## Purpose

What environment variables exist, and where they're validated.

---

## Location

| Piece | File |
|---|---|
| Backend config | `back-end/src/config/env.ts`, `back-end/.env.example` |
| Frontend config | `front-end/src/config/env.ts`, `front-end/.env.example` |
| Design rationale | `docs/architecture-decision-record/ADR-014-Configuration-Platform.md` |

---

## Workflow

Both `env.ts` modules read `process.env`/`import.meta.env` **once at import time**, validate every required key, and throw immediately if anything is missing or malformed — the app never starts in a half-configured state. Every other module imports the validated `env` object; nothing reads `process.env` directly outside these two files.

**Backend** (`back-end/.env.example`):
```
NODE_ENV, PORT, CORS_ORIGIN, DATABASE_URL
JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN_DAYS
BCRYPT_SALT_ROUNDS, ACCOUNT_LOCKOUT_MAX_ATTEMPTS, ACCOUNT_LOCKOUT_DURATION_MINUTES
```

**Frontend** (`front-end/.env.example`, must be prefixed `VITE_` to reach the client bundle):
```
VITE_APP_NAME, VITE_APP_ENV, VITE_API_BASE_URL
```

---

## Common Tasks

| Task | File |
|---|---|
| Add a required backend var | add a `requireEnv(...)` (or `requirePort`/`requirePositiveInt`) call in `back-end/src/config/env.ts`, add it to `.env.example` |
| Add a required frontend var | add a field to `Environment`, validate it in `front-end/src/config/env.ts`, add it to `.env.example` (must start with `VITE_`) |
| Set up a new machine | copy `.env.example` → `.env` in both `front-end/` and `back-end/`, fill in real values |

---

## Commands

```bash
cp back-end/.env.example back-end/.env
cp front-end/.env.example front-end/.env
```

---

## Related Documents

- [Deployment Standards](deployment.md)
- [Authentication](../architecture/authentication.md)

---

## References

- [The Twelve-Factor App — Config](https://12factor.net/config)

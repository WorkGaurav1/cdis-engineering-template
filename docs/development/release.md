# Release Process

**CI enforces the pre-merge checklist automatically now** (`.github/workflows/ci.yml`); there's still no git tagging or changelog. This documents what's automated and what's still manual.

---

## Purpose

What "releasing" currently means in this repo: CI gates every push/PR to `main`; versioning and tagging are still manual.

---

## Location

- CI workflow: `.github/workflows/ci.yml` — single job, ordered stages (see Workflow below).
- No release tooling, no `CHANGELOG.md`, no version-bump script.
- `front-end/package.json` (`0.0.0`) and `back-end/package.json` (`1.0.0`) are versioned independently and are not currently kept in sync with each other or with any tag.

---

## Workflow

CI runs on every push to `main` and every PR, in this locked order (see [Testing Standards](testing.md)):

```
lint → type check → tests (unit + backend integration) → build → Playwright (E2E) → coverage → security checks (npm audit)
```

A failure at any stage blocks the merge (branch protection is a repo-admin setting outside this repo's own files — enable "Require status checks to pass" for the `ci` job once you have push access to configure it). Locally, running the same checks before pushing:

```bash
# frontend
cd front-end
npm run lint && npx tsc -b && npm run test && npm run build

# backend
cd back-end
npm run lint && npm run build && npm run test
# if DB/repository code changed:
docker compose up -d mysql && npm run test:integration

# E2E (from repo root, needs both apps buildable and MySQL running)
npm run test:e2e
```

| Task | Current reality |
|---|---|
| Bump a version | edit the relevant `package.json` by hand — nothing keeps the two in sync |
| Tag a release | not established — see `git-rules.md`'s "Tagging Strategy" / "Semantic Versioning" for the intended convention once this is set up |
| Change the CI pipeline | edit `.github/workflows/ci.yml` directly — see [Testing Standards](testing.md) for the locked stage order before reordering anything |

---

## Related Documents

- [Testing Standards](testing.md)
- [Deployment Standards](deployment.md)
- [Git Standards](../standards/git.md)

---

## References

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

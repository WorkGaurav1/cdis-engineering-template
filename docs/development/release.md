# Release Process

**No formal release process exists yet** — no git tags, no changelog, no CI gate. This documents the current state and the manual checks to run before merging/shipping.

---

## Purpose

What "releasing" currently means in this repo: nothing automated — a manual pre-merge checklist.

---

## Location

- No release tooling, no `CHANGELOG.md`, no version-bump script.
- `front-end/package.json` (`0.0.0`) and `back-end/package.json` (`1.0.0`) are versioned independently and are not currently kept in sync with each other or with any tag.

---

## Workflow

There is no pipeline. Before merging a change, run the same checks CI would run if it existed (see [Testing Standards](testing.md)):

```
lint → type-check → unit tests → build → (integration tests, if backend/DB touched)
```

There is no automatic gate enforcing this — it depends on the person merging.

---

## Common Tasks

**Manual pre-merge checklist**

```bash
# frontend
cd front-end
npm run lint && npx tsc -b && npm run test && npm run build

# backend
cd back-end
npm run lint && npm run build && npm run test
# if DB/repository code changed:
docker compose up -d mysql && npm run test:integration
```

| Task | Current reality |
|---|---|
| Bump a version | edit the relevant `package.json` by hand — nothing keeps the two in sync |
| Tag a release | not established — see `git-rules.md`'s "Tagging Strategy" / "Semantic Versioning" for the intended convention once this is set up |
| Add a real pipeline | wire the checklist above into CI first (see [Deployment Standards](deployment.md)) |

---

## Related Documents

- [Testing Standards](testing.md)
- [Deployment Standards](deployment.md)
- [Git Standards](../standards/git.md)

---

## References

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

# Code Style

TypeScript strict mode + ESLint. No Prettier configured — formatting is not currently enforced.

---

## Purpose

What's actually enforced by tooling in this repo, and what isn't.

---

## Location

| Piece | File |
|---|---|
| Frontend lint | `front-end/eslint.config.js` |
| Backend lint | `back-end/eslint.config.js` |
| Frontend TS config | `front-end/tsconfig.app.json` |
| Backend TS config | `back-end/tsconfig.json` |

---

## Workflow

Both apps: `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.

- **Frontend** — `typescript-eslint` recommended + `eslint-plugin-react-hooks` (flat recommended, includes React Compiler rules like `react-hooks/set-state-in-effect` and `react-hooks/incompatible-library`) + `eslint-plugin-react-refresh`.
- **Backend** — `typescript-eslint` recommended, plus one repo-specific rule: `@typescript-eslint/no-unused-vars` allows an intentionally-unused arg named with a leading underscore (`_req`).
- **No Prettier** — there is no `.prettierrc` or formatting step in either app. Formatting consistency currently depends on the author, not tooling.

---

## Common Tasks

| Task | Command |
|---|---|
| Lint frontend | `cd front-end && npm run lint` |
| Lint backend | `cd back-end && npm run lint` |
| Type-check frontend | `cd front-end && npx tsc -b` |
| Type-check backend | `cd back-end && npm run build` (runs `tsc --noEmit`) |

Run both lint and type-check before committing — neither runs automatically (no pre-commit hook, no CI).

---

## Related Documents

- [Naming Conventions](naming-conventions.md)
- [Testing Standards](testing.md)

---

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [typescript-eslint](https://typescript-eslint.io/)

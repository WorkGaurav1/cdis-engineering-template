# Adding a Database Change

Adding or changing a Prisma model — a new field, a new table, a new relation.

---

## Purpose

The real sequence from editing the schema to a field actually being usable end to end, including what CI and production do differently from local dev.

---

## Location

- `back-end/prisma/schema.prisma` — the schema itself
- `back-end/prisma/migrations/` — generated migration SQL, committed to git
- `back-end/prisma/seed.ts` — reference/demo data
- `back-end/src/repositories/<resource>.repository.ts` — where the new field/model is actually queried

---

## Workflow

```
edit schema.prisma
  → generate + apply a migration (local dev only)
  → regenerate the Prisma Client
  → use the new field in a repository method
  → update seed.ts if the field needs demo/reference data
```

Locally, `prisma migrate dev` does two things at once: writes a new SQL migration file under `prisma/migrations/`, and applies it to your dev database. In CI and production, only `prisma migrate deploy` runs — it applies already-generated migrations, it never generates new ones. This means the migration file has to already exist and be committed *before* it reaches CI; there's no "generate the migration in production" path.

---

## Common Tasks

| Step | Command / File |
|---|---|
| 1. Edit the schema | `back-end/prisma/schema.prisma` |
| 2. Generate + apply the migration | `cd back-end && npm run prisma:migrate -- --name <short-description>` |
| 3. Regenerate the Prisma Client | happens automatically as part of step 2; run `npm run prisma:generate` by hand if you ever need to re-sync it without a schema change |
| 4. Use the field | add/update a method in `repositories/<resource>.repository.ts` |
| 5. Add reference/demo data, if needed | `back-end/prisma/seed.ts`, then `npm run prisma:seed` |
| 6. Commit the migration file | `prisma/migrations/<timestamp>_<name>/migration.sql` — this is real source, not a build artifact; it must be committed |
| Reset your local dev database | `npx prisma migrate reset` (drops and re-applies every migration, then re-seeds — destructive, dev-only) |

---

## Related Documents

- [Database Standards](../standards/database.md)
- [Adding an API Endpoint](adding-api.md)
- [Removing a Feature](removing-a-feature.md)

---

## References

- [Prisma Migrate Documentation](https://www.prisma.io/docs/orm/prisma-migrate)

# Database Standards

MySQL 8 via Prisma 7, accessed only through the repository layer.

---

## Purpose

How the schema, migrations, and data access are organized in this project.

---

## Location

| Piece | File |
|---|---|
| Schema | `back-end/prisma/schema.prisma` |
| Datasource/migration config | `back-end/prisma.config.ts` (Prisma 7 moved this out of the schema file) |
| Client singleton | `back-end/src/lib/prisma.ts` |
| Seed script | `back-end/prisma/seed.ts` |
| Migrations | `back-end/prisma/migrations/` |
| Data access | `back-end/src/repositories/*.repository.ts` — **only** place `prisma.*` is called |

---

## Workflow

```
DATABASE_URL → PrismaMariaDb driver adapter → PrismaClient (lib/prisma.ts)
  ↓
repositories/*.repository.ts   ← the only layer that imports `prisma`
  ↓
services/*.service.ts          ← business logic, no Prisma calls
```

Client is cached on `globalThis` outside production so `tsx watch` hot-reloads reuse one connection pool instead of leaking a new one per file change.

**Schema summary**: `User` (soft-delete via `deletedAt`, self-referencing `createdBy`/`updatedBy` audit fields, lockout fields) — `Role` / `Permission` many-to-many via `UserRole` / `RolePermission` — `RefreshToken` (hashed token, `replacedByTokenId` forms a rotation chain). See [Authorization](../architecture/authorization.md) for how roles/permissions are used.

---

## Common Tasks

| Task | Command / File |
|---|---|
| Change the schema | edit `schema.prisma`, then `npm run prisma:migrate` |
| Regenerate the client after pulling schema changes | `npm run prisma:generate` |
| Re-seed roles/permissions | `npm run prisma:seed` |
| Inspect data | `npm run prisma:studio` |
| Add a query | add a method to the relevant `repositories/*.repository.ts` — never call `prisma` from a service or controller |

---

## Commands

```bash
cd back-end
npm run prisma:migrate    # dev migration
npm run prisma:seed
npm run prisma:studio
```

---

## Related Documents

- [Authorization](../architecture/authorization.md)
- [Environment Standards](environment.md)

---

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)

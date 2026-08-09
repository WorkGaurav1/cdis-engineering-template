# Project Structure

Defines the standard directory structure used across the CDIS Engineering Template.

---

## Repository Structure

```text
.
├── front-end/            # React application
├── back-end/             # Node.js application
├── docs/                 # Engineering documentation
├── docker-compose.yml
└── README.md
```

---

## Frontend Structure

```text
front-end/
├── src/
│   ├── app/
│   ├── assets/
│   ├── auth/
│   ├── components/
│   ├── config/
│   ├── features/
│   ├── layouts/
│   ├── routes/
│   ├── shared/
│   ├── styles/
│   └── main.tsx
│
├── public/
└── README.md
```

| Directory | Purpose |
|------------|---------|
| `app/` | Application bootstrap and providers |
| `assets/` | Images, fonts, icons |
| `auth/` | Authentication module |
| `components/` | Shared UI components |
| `config/` | Application configuration |
| `features/` | Business features |
| `layouts/` | Application layouts |
| `routes/` | Route configuration |
| `shared/` | Shared hooks, services, utilities and types |
| `styles/` | Global styles |

---

## Backend Structure

```text
back-end/
├── src/
│   ├── auth/
│   ├── common/
│   ├── config/
│   ├── dashboard/
│   ├── database/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── users/
│   ├── utils/
│   └── server.ts
│
├── prisma/
└── README.md
```

| Directory | Purpose |
|------------|---------|
| `auth/` | Authentication & Authorization |
| `common/` | Shared backend utilities |
| `config/` | Application configuration |
| `dashboard/` | Dashboard module |
| `database/` | Database configuration |
| `middleware/` | Express middleware |
| `routes/` | Route registration |
| `services/` | Shared backend services |
| `users/` | User module |
| `utils/` | Helper utilities |
| `prisma/` | Prisma schema and migrations |

---

## Documentation Structure

```text
docs/
├── architecture/
├── development/
└── standards/
```

| Directory | Purpose |
|------------|---------|
| `architecture/` | System architecture |
| `development/` | Development workflows |
| `standards/` | Engineering standards |

---

## Where Should I Put My Code?

| If you are adding... | Location |
|----------------------|----------|
| New feature | `front-end/src/features/<feature>/` |
| New page | `features/<feature>/pages/` |
| Reusable component | `components/` |
| Feature component | `features/<feature>/components/` |
| Custom hook | `features/<feature>/hooks/` |
| API client | `features/<feature>/api/` |
| Service | `features/<feature>/services/` |
| Validation schema | `features/<feature>/schemas/` |
| Shared utility | `shared/utils/` |
| Shared hook | `shared/hooks/` |
| Shared types | `shared/types/` |
| Route | `routes/` |
| Backend module | `back-end/src/<module>/` |
| Database model | `back-end/prisma/schema.prisma` |
| Documentation | `docs/` |

---

## Avoid

- Creating new top-level folders without team discussion.
- Duplicating shared code across features.
- Placing business logic inside UI components.
- Placing database logic inside controllers.
- Adding project documentation outside the `docs/` directory.

---

## Related Documents

- `frontend.md`
- `backend.md`
- `authentication.md`
- `authorization.md`
- `routing.md`

---

## References

- React Project Structure  
  https://react.dev/

- Express Documentation  
  https://expressjs.com/

- Prisma Documentation  
  https://www.prisma.io/docs
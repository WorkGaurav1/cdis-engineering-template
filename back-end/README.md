# Backend

Backend application built using Node.js, Express, TypeScript, and MySQL following the CDIS engineering standards.

---

## Technology Stack

- Node.js
- Express
- TypeScript
- MySQL
- Prisma ORM
- JWT Authentication
- Zod Validation

---

## Project Structure

```text
src/
├── auth/
├── users/
├── dashboard/
├── common/
├── config/
├── database/
├── middleware/
├── routes/
├── services/
├── utils/
└── server.ts
```

---

## Install

```bash
npm install
```

---

## Development

Start the development server.

```bash
npm run dev
```

---

## Build

```bash
npm run build
```

---

## Start Production Server

```bash
npm start
```

---

## Database

Run database migrations.

```bash
npx prisma migrate dev
```

Generate Prisma Client.

```bash
npx prisma generate
```

Seed database.

```bash
npx prisma db seed
```

---

## Development Workflow

When adding a new module:

1. Create module.
2. Create routes.
3. Create controller.
4. Create service.
5. Create repository.
6. Add validation.
7. Add tests.
8. Update documentation.

---

## Backend Standards

- Feature-first architecture
- Layered architecture
- Controller → Service → Repository pattern
- TypeScript Strict Mode
- Prisma ORM
- JWT Authentication
- Zod Validation
- Centralized error handling
- Environment-based configuration

See:

- `../docs/architecture/backend.md`
- `../docs/architecture/authentication.md`
- `../docs/standards/api.md`
- `../docs/standards/database.md`
- `../docs/standards/security.md`

---

## Testing

Run backend tests.

```bash
npm test
```

Run coverage.

```bash
npm run test:coverage
```

---

## References

- Node.js — https://nodejs.org
- Express — https://expressjs.com
- TypeScript — https://www.typescriptlang.org
- Prisma — https://www.prisma.io/docs
- MySQL — https://dev.mysql.com/doc/
- Zod — https://zod.dev
# CDIS Engineering Template

Production-ready full-stack engineering template for building secure, scalable, and maintainable web applications using standardized engineering practices.

---

## Features

- React + TypeScript + Vite
- Node.js + Express
- MySQL Database
- JWT Authentication
- Role-Based Access Control (RBAC)
- React Hook Form + Zod
- Docker Support
- Testing (Unit, Integration & E2E)
- CI/CD Ready

---

## Repository Structure


.
├── front-end/      # React application
├── back-end/       # Node.js application
├── docs/           # Engineering documentation
└── README.md


---

## Prerequisites

- Git
- Node.js (LTS)
- npm
- Docker
- Docker Compose

---

## Bootstrap

### Clone Repository

bash
git clone <repository-url>
cd cdis-engineering-template


### Install Dependencies

Frontend

```bash
cd front-end
npm install
```

Backend

```bash
cd ../back-end
npm install
```

### Start Database

```bash
docker compose up -d
```

### Start Backend

```bash
cd back-end
npm run dev
```

### Start Frontend

```bash
cd front-end
npm run dev
```

---

## Build

Frontend

```bash
cd front-end
npm run build
```

Backend

```bash
cd back-end
npm run build
```

---

## Testing

Frontend

```bash
cd front-end
npm test
```

Backend

```bash
cd back-end
npm test
```

End-to-End

```bash
npm run test:e2e
```

---

## Development Workflow

### Add a New Feature

1. Create feature/module.
2. Implement frontend.
3. Implement backend.
4. Add validation.
5. Add tests.
6. Update documentation.

See:

- `docs/development/adding-feature.md`

### Remove a Feature

1. Remove routes.
2. Remove UI.
3. Remove API.
4. Remove tests.
5. Update documentation.

---

## Documentation

| Document | Purpose |
|----------|---------|
| `front-end/README.md` | Frontend development guide |
| `back-end/README.md` | Backend development guide |
| `docs/architecture/` | System architecture |
| `docs/standards/` | Engineering standards |
| `docs/development/` | Development workflows |

---

## References

- React — https://react.dev
- Vite — https://vite.dev
- Node.js — https://nodejs.org
- Express — https://expressjs.com
- TypeScript — https://www.typescriptlang.org
- MySQL — https://dev.mysql.com/doc/
- Docker — https://docs.docker.com/
- OWASP Cheat Sheet Series — https://cheatsheetseries.owasp.org/
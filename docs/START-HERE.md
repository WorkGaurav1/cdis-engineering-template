# Start Here

The golden path from a clean clone to your first PR. Every command here is real and project-specific — nothing generic to React/Express, only what CDIS actually needs.

---

## 1. What this is

CDIS's engineering template: a React + TypeScript frontend, a Node.js + Express + TypeScript backend, cookie-based auth with RBAC, and a real Docker/CI/CD pipeline — meant to be cloned and extended for a new project, not deployed as-is.

Three sibling repositories — `cdis-frontend`, `cdis-backend`, `cdis-deployment` — are independently clone/build/run-able exports of this repo's `front-end/`, `back-end/`, and `deployment/` folders. If you only need one piece standalone (e.g. you're only touching the backend), clone the matching sibling repo instead. If you're extending the template itself, work here.

---

## 2. Prerequisites

- Git
- Node.js 22+
- npm
- Docker + Docker Compose v2

---

## 3. Clone and install

```bash
git clone <repository-url>
cd cdis-engineering-template

cd front-end && npm install && cd ..
cd back-end && npm install && cd ..
cd deployment && npm install && cd ..   # only needed for the E2E suite
```

---

## 4. Configure environment

```bash
cp front-end/.env.example front-end/.env
cp back-end/.env.example back-end/.env
```

Defaults in both files match the local MySQL container's credentials below — no edits needed for local dev.

---

## 5. Start the database

```bash
docker compose -f deployment/compose/compose.yaml up -d mysql
```

Then apply migrations and seed reference data (roles/permissions + demo datasets — no login user is seeded, see step 8):

```bash
cd back-end
npm run prisma:migrate
npm run prisma:seed
```

---

## 6. Start the backend and frontend

```bash
# terminal 1
cd back-end && npm run dev

# terminal 2
cd front-end && npm run dev
```

---

## 7. Verify it's running

- Backend health: `curl http://localhost:4000/health` → `{"success":true,"data":{"status":"ok",...}}`
- Frontend: open `http://localhost:5173`

---

## 8. Log in

No demo user is seeded — register your own account once:

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"correct-horse-battery-staple","name":"Your Name"}'
```

Then log in at `http://localhost:5173` with that email/password.

---

## 9. Run the tests

```bash
cd front-end && npm test
cd back-end && npm test          # unit only
cd back-end && npm run test:all  # unit + integration (needs a `cdis_test` database — see back-end/README.md)
```

Cross-application E2E (drives a real browser against the whole stack):

```bash
cd deployment
./scripts/e2e-up.sh
npm run test:e2e
```

---

## 10. Common tasks

Each of these is a short, real, command-first doc — not a generic tutorial:

- [Adding a feature](development/adding-feature.md) — the feature-module self-registration pattern
- [Removing a feature](development/removing-a-feature.md) — most commonly, deleting the demo content
- [Adding an API endpoint](development/adding-api.md) — route → DTO → middleware → controller → service → repository
- [Adding a database change](development/adding-a-db-change.md) — schema → migration → seed

---

## 11. Before you open a PR

```bash
cd front-end && npm run lint && npx tsc -b && npm test
cd back-end && npm run lint && npm run build && npm run test:all
```

These are exactly the checks CI runs — green locally means green in CI.

---

## 12. Understand what's example content

The dashboard, charts, graphs, and tables features are demonstration content — backed by literal `/api/v1/demo/...` endpoints and Prisma models named `DemoStateMetric`/`DemoChartDataset`/etc. They exist to show real, working patterns for maps/charts/tables; a new project deletes or replaces them (see [Removing a Feature](development/removing-a-feature.md)). `auth/`, the API client, and the shared `Chart`/`DataTable`/`Map` components are foundational — keep those.

---

## Next

- [`docs/architecture/system-design.md`](architecture/system-design.md) — how the pieces fit together, request flow, session design
- [`docs/standards/`](standards/) — coding, testing, security, Docker, deployment conventions
- [`deployment/README.md`](../deployment/README.md) — the full deployment story, if you're touching that

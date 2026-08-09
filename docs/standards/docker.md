# Docker Standards

Docker is used for the local MySQL database only. There are no Dockerfiles for the frontend or backend apps.

---

## Purpose

What the existing `docker-compose.yml` actually provides, and what's not there yet.

---

## Location

- `docker-compose.yml` (repo root) — one service: `mysql`

---

## Workflow

```yaml
mysql:
  image: mysql:8.0
  ports: ["3308:3306"]        # host 3308 → container 3306
  environment:
    MYSQL_DATABASE: cdis
    MYSQL_USER: cdis
    MYSQL_PASSWORD: cdis_dev_password
    MYSQL_ROOT_PASSWORD: cdis_root_dev_password
  volumes: [mysql-data:/var/lib/mysql]   # persists across restarts
  healthcheck: mysqladmin ping
```

`back-end/.env`'s `DATABASE_URL` points at `localhost:3308` to match. Neither `front-end/` nor `back-end/` has a `Dockerfile` — both run directly on the host via `npm run dev`/`npm run start`.

---

## Common Tasks

| Task | Command |
|---|---|
| Start the dev database | `docker compose up -d mysql` |
| Stop it | `docker compose down` |
| Stop and wipe all data | `docker compose down -v` |
| Tail logs | `docker compose logs -f mysql` |
| Open a MySQL shell | `docker exec -it cdis-mysql mysql -ucdis -pcdis_dev_password cdis` |
| Add a Dockerfile for an app | none exists to follow yet — see [Deployment Standards](deployment.md) for what `build`/`start` need to produce first |

---

## Related Documents

- [Deployment Standards](deployment.md)
- [Environment Standards](environment.md)
- [Database Standards](database.md)

---

## References

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Official Image](https://hub.docker.com/_/mysql)

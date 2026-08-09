# API Standards

REST under `/api/v1`, one response envelope, one validation path, one error path.

---

## Purpose

The conventions every backend route in this project follows.

---

## Location

| Piece | File |
|---|---|
| Response envelope | `back-end/src/utils/apiResponse.ts` (`sendSuccess`, `sendError`) |
| Error types | `back-end/src/errors/AppError.ts` |
| Central error handler | `back-end/src/middlewares/errorHandler.ts` |
| Body validation | `back-end/src/middlewares/validate.ts` (`validateBody`) + per-route Zod schema in `dto/` |
| Route mounting | `back-end/src/routes/index.ts` |
| Frontend client | `front-end/src/api/client/apiClient.ts`, `httpClient.ts`, `interceptors.ts` |

---

## Workflow

**Envelope** — every response is one of:
```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

**Request handling**
```
route → validateBody(schema) → controller → service → repository → Prisma
  controller calls sendSuccess(res, data, statusCode)
  any thrown AppError subclass → errorHandler → sendError(...)
  unexpected (non-AppError) throw → logged in full, client gets a generic 500
```

Frontend `apiClient.get/post/put/patch/delete` unwraps `.data.data` automatically — feature `api/*.ts` files call `apiClient`, not `httpClient`, directly.

---

## Common Tasks

| Task | File |
|---|---|
| Add an endpoint | route in `routes/<name>.routes.ts` → controller → service; validate with a Zod schema in `dto/` |
| Return a new error type | add a class to `errors/AppError.ts` (statusCode + code), `throw` it from the service |
| Call the API from the frontend | add a method to that feature's `api/<name>Api.ts` using `apiClient` |

---

## Related Documents

- [Authentication](../architecture/authentication.md)
- [Security Standards](security.md)
- [Adding an API](../development/adding-api.md)

---

## References

- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md)
- [Zod Documentation](https://zod.dev/)

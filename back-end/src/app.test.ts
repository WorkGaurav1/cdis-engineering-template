import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

// This is a plain unit test, not *.integration.test.ts — it must never
// touch a real database. Every scenario below is chosen specifically
// because it resolves (401/400/404) before any repository/Prisma call
// happens, and prisma is mocked regardless as a hard guarantee.
vi.mock("./lib/prisma.js", () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
  },
}));

const { createApp } = await import("./app.js");

const app = createApp();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createApp — routing and middleware wiring", () => {
  it("mounts the health check at the unversioned /health path", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, data: { status: "ok" } });
  });

  it("returns a 404 envelope, naming the method and path, for an unmatched route", async () => {
    const res = await request(app).post("/api/v1/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      error: { code: "ROUTE_NOT_FOUND", message: "No route found for POST /api/v1/does-not-exist" },
    });
  });

  it("mounts the auth router under /api/v1/auth (requireAuth rejects before touching the DB)", async () => {
    const res = await request(app).get("/api/v1/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("mounts the user router under /api/v1/users, gated by requireAuth", async () => {
    const res = await request(app).get("/api/v1/users");

    expect(res.status).toBe(401);
  });

  it("mounts the demo router under /api/v1/demo, gated by requireAuth", async () => {
    const res = await request(app).get("/api/v1/demo/map/states");

    expect(res.status).toBe(401);
  });

  it("runs body validation before any controller/DB logic, rejecting a bad register payload with 400", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({ email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("applies security headers via helmet", async () => {
    const res = await request(app).get("/health");

    expect(res.headers).toHaveProperty("x-frame-options");
    expect(res.headers).toHaveProperty("x-content-type-options");
  });

  it("echoes the configured CORS origin with credentials enabled", async () => {
    const res = await request(app).get("/health").set("Origin", "http://localhost:5173");

    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });

  it("applies the global rate limiter to every request", async () => {
    const res = await request(app).get("/health");

    expect(res.headers).toHaveProperty("ratelimit-limit");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockRequest, createMockResponse } from "../test-utils/expressMocks.js";

vi.mock("../services/user.service.js", () => ({
  userService: {
    list: vi.fn(),
  },
}));

const { userService } = await import("../services/user.service.js");
const { listUsers } = await import("./user.controller.js");

const pagination = { limit: 20, offset: 0 };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("listUsers", () => {
  it("passes req.validatedQuery straight through to the service as the pagination params", async () => {
    vi.mocked(userService.list).mockResolvedValue({ users: [], total: 0 });
    const res = createMockResponse();

    await listUsers(createMockRequest({ validatedQuery: { limit: 5, offset: 15 } }), res);

    expect(userService.list).toHaveBeenCalledWith({ limit: 5, offset: 15 });
  });

  it("wraps the service result under `users`, and echoes limit/offset/total under `pagination`", async () => {
    vi.mocked(userService.list).mockResolvedValue({
      users: [{ id: "u1", email: "a@example.com" }] as never,
      total: 1,
    });
    const res = createMockResponse();

    await listUsers(createMockRequest({ validatedQuery: pagination }), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        users: [{ id: "u1", email: "a@example.com" }],
        pagination: { limit: 20, offset: 0, total: 1 },
      },
    });
  });

  it("returns an empty array as-is when there are no users", async () => {
    vi.mocked(userService.list).mockResolvedValue({ users: [], total: 0 });
    const res = createMockResponse();

    await listUsers(createMockRequest({ validatedQuery: pagination }), res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { users: [], pagination: { limit: 20, offset: 0, total: 0 } },
    });
  });
});

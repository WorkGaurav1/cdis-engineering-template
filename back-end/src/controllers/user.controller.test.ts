import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockRequest, createMockResponse } from "../test-utils/expressMocks.js";

vi.mock("../services/user.service.js", () => ({
  userService: {
    list: vi.fn(),
  },
}));

const { userService } = await import("../services/user.service.js");
const { listUsers } = await import("./user.controller.js");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("listUsers", () => {
  it("wraps the service result under a `users` key and returns 200", async () => {
    vi.mocked(userService.list).mockResolvedValue([{ id: "u1", email: "a@example.com" }] as never);
    const res = createMockResponse();

    await listUsers(createMockRequest(), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { users: [{ id: "u1", email: "a@example.com" }] },
    });
  });

  it("returns an empty array as-is when there are no users", async () => {
    vi.mocked(userService.list).mockResolvedValue([]);
    const res = createMockResponse();

    await listUsers(createMockRequest(), res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: { users: [] } });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api", () => ({ apiClient: { get: vi.fn() } }));

const { apiClient } = await import("@/api");
const { userApi } = await import("./userApi");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("userApi.list", () => {
  it("gets /users with limit/offset as query params", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ users: [], pagination: { limit: 20, offset: 0, total: 0 } });

    await userApi.list({ limit: 20, offset: 40 });

    expect(apiClient.get).toHaveBeenCalledWith("/users", { limit: 20, offset: 40 });
  });
});

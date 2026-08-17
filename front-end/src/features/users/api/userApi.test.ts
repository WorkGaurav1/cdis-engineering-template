import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api", () => ({ apiClient: { get: vi.fn() } }));

const { apiClient } = await import("@/api");
const { userApi } = await import("./userApi");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("userApi.list", () => {
  it("gets /users", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ users: [] });

    await userApi.list();

    expect(apiClient.get).toHaveBeenCalledWith("/users");
  });
});

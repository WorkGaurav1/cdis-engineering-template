import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api", () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}));

const { apiClient } = await import("@/api");
const { authApi } = await import("./authApi");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authApi", () => {
  it("login posts credentials to /auth/login", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ user: { id: "u1" } });

    await authApi.login({ email: "a@b.com", password: "pw" });

    expect(apiClient.post).toHaveBeenCalledWith("/auth/login", { email: "a@b.com", password: "pw" });
  });

  it("refresh posts to /auth/refresh with no body", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ user: { id: "u1" } });

    await authApi.refresh();

    expect(apiClient.post).toHaveBeenCalledWith("/auth/refresh");
  });

  it("getCurrentUser gets /auth/me", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ user: { id: "u1" } });

    await authApi.getCurrentUser();

    expect(apiClient.get).toHaveBeenCalledWith("/auth/me");
  });

  it("logout posts to /auth/logout", async () => {
    vi.mocked(apiClient.post).mockResolvedValue(undefined);

    await authApi.logout();

    expect(apiClient.post).toHaveBeenCalledWith("/auth/logout");
  });
});

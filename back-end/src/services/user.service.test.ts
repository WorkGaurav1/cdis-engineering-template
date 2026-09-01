import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../repositories/user.repository.js", () => ({
  userRepository: {
    findAll: vi.fn(),
    count: vi.fn(),
  },
}));

const { userRepository } = await import("../repositories/user.repository.js");
const { userService } = await import("./user.service.js");

const pagination = { limit: 20, offset: 0 };

function fakeUserWithRoles(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    passwordHash: "should-not-leak",
    roles: [{ role: { name: "user", permissions: [{ permission: { key: "users:read" } }] } }],
    ...overrides,
  } as never;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("userService.list", () => {
  it("passes limit/offset straight through to the repository", async () => {
    vi.mocked(userRepository.findAll).mockResolvedValue([]);
    vi.mocked(userRepository.count).mockResolvedValue(0);

    await userService.list({ limit: 5, offset: 15 });

    expect(userRepository.findAll).toHaveBeenCalledWith({ limit: 5, offset: 15 });
  });

  it("returns an empty list and total 0 when there are no users", async () => {
    vi.mocked(userRepository.findAll).mockResolvedValue([]);
    vi.mocked(userRepository.count).mockResolvedValue(0);

    await expect(userService.list(pagination)).resolves.toEqual({ users: [], total: 0 });
  });

  it("maps every user through toSafeUser, stripping passwordHash, and reports the full total (not just this page's length)", async () => {
    vi.mocked(userRepository.findAll).mockResolvedValue([
      fakeUserWithRoles({ id: "user-1", email: "a@example.com" }),
      fakeUserWithRoles({ id: "user-2", email: "b@example.com" }),
    ]);
    // total (57) deliberately differs from this page's length (2) — proves
    // `total` reflects the whole collection, not the current page size,
    // which is the entire point of returning it alongside a bounded page.
    vi.mocked(userRepository.count).mockResolvedValue(57);

    const result = await userService.list(pagination);

    expect(result.total).toBe(57);
    expect(result.users).toHaveLength(2);
    expect(result.users[0]).not.toHaveProperty("passwordHash");
    expect(result.users[0]).toEqual({
      id: "user-1",
      email: "a@example.com",
      name: "Test User",
      roles: ["user"],
      permissions: ["users:read"],
    });
  });
});

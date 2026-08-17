import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../repositories/user.repository.js", () => ({
  userRepository: {
    findAll: vi.fn(),
  },
}));

const { userRepository } = await import("../repositories/user.repository.js");
const { userService } = await import("./user.service.js");

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
  it("returns an empty list when there are no users", async () => {
    vi.mocked(userRepository.findAll).mockResolvedValue([]);

    await expect(userService.list()).resolves.toEqual([]);
  });

  it("maps every user through toSafeUser, stripping passwordHash", async () => {
    vi.mocked(userRepository.findAll).mockResolvedValue([
      fakeUserWithRoles({ id: "user-1", email: "a@example.com" }),
      fakeUserWithRoles({ id: "user-2", email: "b@example.com" }),
    ]);

    const result = await userService.list();

    expect(result).toHaveLength(2);
    expect(result[0]).not.toHaveProperty("passwordHash");
    expect(result[0]).toEqual({
      id: "user-1",
      email: "a@example.com",
      name: "Test User",
      roles: ["user"],
      permissions: ["users:read"],
    });
  });
});

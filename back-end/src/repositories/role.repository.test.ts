import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    role: {
      findFirst: vi.fn(),
    },
  },
}));

const { prisma } = await import("../lib/prisma.js");
const { roleRepository } = await import("./role.repository.js");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("roleRepository.findByName", () => {
  it("filters by name and excludes soft-deleted roles", async () => {
    vi.mocked(prisma.role.findFirst).mockResolvedValue({ id: "r1", name: "admin" } as never);

    const result = await roleRepository.findByName("admin");

    expect(prisma.role.findFirst).toHaveBeenCalledWith({ where: { name: "admin", deletedAt: null } });
    expect(result).toEqual({ id: "r1", name: "admin" });
  });

  it("returns null when no role matches", async () => {
    vi.mocked(prisma.role.findFirst).mockResolvedValue(null);

    await expect(roleRepository.findByName("nonexistent")).resolves.toBeNull();
  });
});

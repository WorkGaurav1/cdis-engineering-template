import { prisma } from "../lib/prisma.js";

export const roleRepository = {
  findByName(name: string) {
    return prisma.role.findFirst({ where: { name, deletedAt: null } });
  },
};

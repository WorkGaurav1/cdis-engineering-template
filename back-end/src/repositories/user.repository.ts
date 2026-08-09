import { prisma } from "../lib/prisma.js";

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash: string;
}

/**
 * All direct Prisma access for the User model. No auth/business rules
 * here — just persistence. Roles/permissions are always included since
 * every caller that loads a user needs them for authorization checks.
 */
export const userRepository = {
  findAll() {
    return prisma.user.findMany({
      where: { deletedAt: null },
      include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
    });
  },

  findById(id: string) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
    });
  },

  create(input: CreateUserInput) {
    return prisma.user.create({
      data: input,
    });
  },

  assignRole(userId: string, roleId: string) {
    return prisma.userRole.create({
      data: { userId, roleId },
    });
  },

  recordFailedLogin(userId: string, failedLoginAttempts: number, lockedUntil: Date | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts, lockedUntil },
    });
  },

  resetFailedLogins(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
  },
};

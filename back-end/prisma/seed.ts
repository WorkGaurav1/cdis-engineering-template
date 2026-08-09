/**
 * Seeds the baseline roles and permissions every environment needs to
 * exist before the auth service can assign a default role at
 * registration. Idempotent (safe to re-run) — uses upsert throughout.
 */
import { prisma } from "../src/lib/prisma.js";

const PERMISSIONS = [
  { key: "users:read", description: "View user accounts" },
  { key: "users:write", description: "Create, edit, or deactivate user accounts" },
  { key: "roles:manage", description: "Assign or modify roles and permissions" },
] as const;

const ROLES: Record<string, { description: string; permissions: string[] }> = {
  admin: {
    description: "Full administrative access",
    permissions: ["users:read", "users:write", "roles:manage"],
  },
  manager: {
    description: "Can view user accounts",
    permissions: ["users:read"],
  },
  user: {
    description: "Standard authenticated user, no elevated access",
    permissions: [],
  },
};

async function main(): Promise<void> {
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: { description: permission.description },
      create: permission,
    });
  }

  for (const [name, definition] of Object.entries(ROLES)) {
    const role = await prisma.role.upsert({
      where: { name },
      update: { description: definition.description },
      create: { name, description: definition.description },
    });

    for (const permissionKey of definition.permissions) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: { key: permissionKey },
      });

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  console.info("Seed complete: roles and permissions are up to date.");
}

await main();
await prisma.$disconnect();

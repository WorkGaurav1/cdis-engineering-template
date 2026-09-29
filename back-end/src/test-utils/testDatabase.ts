/**
 * The integration-test database — `cdis_test` on the local dev MySQL
 * (deployment/compose/compose.dev.yaml, which creates it) and on CI's
 * service container. Shared by vitest.integration.config.ts and
 * prisma/prepare-test-database.ts so the two can never point at
 * different databases.
 */
export const TEST_DATABASE_URL = "mysql://cdis:cdis_dev_password@localhost:3308/cdis_test";

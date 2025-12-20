import { prisma } from "../../src/lib/prisma";
import bcrypt from "bcrypt";
import { TEST_PREFIX } from "../setup";

export async function createUser(
  overrides: Partial<{ email: string; name: string; password: string }> = {}
) {
  const uniqueId = Date.now();

  return prisma.user.create({   // create a test user with test prefix in db
    data: {
      name: overrides.name || `${TEST_PREFIX}User ${uniqueId}`,
      email: overrides.email || `${TEST_PREFIX}user${uniqueId}@test.com`,
      password: overrides.password
        ? await bcrypt.hash(overrides.password, 10)
        : await bcrypt.hash("password", 10),
      ...overrides,
    },
  });
}

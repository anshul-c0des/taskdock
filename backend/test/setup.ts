import { prisma } from "../src/lib/prisma";

export const TEST_PREFIX = "testing-";   // unique prefix for test data

beforeAll(async () => {
  await prisma.$connect(); // connect prisma
});

afterAll(async () => {
  await prisma.$disconnect(); // disconnect prisma
});

export async function cleanupTestData() {
  const testUsers = await prisma.user.findMany({   // finds all user with test prefix
    where: { email: { startsWith: TEST_PREFIX } },
    select: { id: true },
  });

  const testUserIds = testUsers.map((u) => u.id);   // collect test user id's

  if (testUserIds.length > 0) {   // delete tasks created by test users
    await prisma.task.deleteMany({
      where: { createdById: { in: testUserIds } },
    });
  }

  await prisma.task.deleteMany({   // delete any rem tasks with test prefix
    where: { title: { startsWith: TEST_PREFIX } },
  });

  await prisma.user.deleteMany({   // delete test users
    where: { email: { startsWith: TEST_PREFIX } },
  });
}

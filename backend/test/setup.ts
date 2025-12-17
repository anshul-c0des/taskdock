import { prisma } from "../src/lib/prisma";

export const TEST_PREFIX = "testing-";

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export async function cleanupTestData() {
  await prisma.task.deleteMany({
    where: {
      OR: [
        { title: { startsWith: TEST_PREFIX } },
        { createdBy: { email: { startsWith: TEST_PREFIX } } },
        { assignedTo: { email: { startsWith: TEST_PREFIX } } },
      ],
    },
  });

  await prisma.user.deleteMany({
    where: { email: { startsWith: TEST_PREFIX } },
  });
}
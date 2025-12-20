import { Prisma } from "@prisma/client";
import { prisma } from "../../src/lib/prisma";
import { TEST_PREFIX } from "../setup";

type TaskOverrides = Partial<Prisma.TaskUncheckedCreateInput> & {
  createdById: string;
};

export async function createTask(overrides: TaskOverrides) {
  const uniqueId = Date.now();

  return prisma.task.create({   // creates a task with test prefix in db
    data: {
      title: overrides.title || `${TEST_PREFIX}Task ${uniqueId}`,
      dueDate: overrides.dueDate || new Date(),
      ...overrides,
    },
  });
}

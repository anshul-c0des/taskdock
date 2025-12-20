import { prisma } from "../lib/prisma";

// used for task creation and task assigment by tests

export async function createTask(data: {   // create a new task
  title: string;
  dueDate: Date;
  createdById: string;
}) {
  return prisma.task.create({ data });
}

export async function assignTask(taskId: string, userId: string) {   // update a task and assign to user
  return prisma.task.update({
    where: { id: taskId },
    data: { assignedToId: userId },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });
}

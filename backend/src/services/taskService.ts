import { prisma } from "../lib/prisma";

export async function createTask(data: { title: string; dueDate: Date; createdById: string }) {
  return prisma.task.create({ data });
}

export async function assignTask(taskId: string, userId: string) {
    return prisma.task.update({
      where: { id: taskId },
      data: { assignedToId: userId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

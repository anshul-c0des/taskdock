import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { io } from '../lib/socket';
import { assignTask } from '../services/taskService';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { title, description, priority, dueDate, assignedToId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate
        ? new Date(`${dueDate}T00:00:00.000Z`)
        : null,
        createdById: user.id,
        assignedToId: assignedToId || null,
      },
    });

    io.to(user.id).emit('task:created', task);

    if(assignedToId) io.to(assignedToId).emit('task:assigned', task);

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { createdById: user.id },
          { assignedToId: user.id },
        ],
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
};


export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        OR: [
          { createdById: user.id },
          { assignedToId: user.id },
        ],
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user; // authenticated user
    const { id } = req.params;
    const { title, description, status, priority, dueDate, assignedToId } = req.body;

    // Find the task
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isCreator = task.createdById === user.id;
    const isAssigned = task.assignedToId === user.id;

    if (!isCreator && !isAssigned) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Prepare update data
    const data: any = {};

    if (isCreator) {
      // Creator can update all fields
      if (title !== undefined) data.title = title;
      if (description !== undefined) data.description = description;
      if (status !== undefined) data.status = status;
      if (priority !== undefined) data.priority = priority;
      if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
      if (assignedToId !== undefined) data.assignedToId = assignedToId || null;
    } else if (isAssigned) {
      // Assigned user can only update status
      if (status !== undefined) data.status = status;
    }

    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id },
      data,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    // Notify users via socket
    io.to(task.createdById).emit("task:updated", updatedTask);
    if (updatedTask.assignedToId) io.to(updatedTask.assignedToId).emit("task:updated", updatedTask);

    res.status(200).json({ task: updatedTask });
  } catch (err) {
    next(err);
  }
};


export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.createdById !== user.id) return res.status(403).json({ message: 'Forbidden' });
    const assignedToId = task.assignedToId;
    await prisma.task.delete({ where: { id } });

    io.to(user.id).emit('task:deleted', task);

    if(assignedToId) io.to(assignedToId).emit('task:deleted', task);

    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};


export const assignTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params;
    const { assignedToId } = req.body;

    // Update the task assignment
    const updatedTask = await assignTask(taskId, assignedToId);

    // Emit socket notification
    io.to(assignedToId).emit("task:assigned", updatedTask);

    res.status(200).json({ task: updatedTask });
  } catch (err) {
    next(err);
  }
};
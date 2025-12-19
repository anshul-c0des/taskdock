import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { io } from '../lib/socket';
import { assignTask } from '../services/taskService';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { title, description, priority, dueDate, assignedToId } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required and must be a string" });
    }

    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    if (!priority || !validPriorities.includes(priority)) {
      return res.status(400).json({ error: "Priority must be one of LOW, MEDIUM, HIGH" });
    }

    let parsedDueDate: Date | null = null;
    if (dueDate && dueDate.trim() !== "") {
      const d = new Date(dueDate);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ error: "Invalid dueDate format" });
      }
      parsedDueDate = d;
    }
    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        priority,
        dueDate: parsedDueDate,
        createdById: user.id,
        assignedToId: assignedToId || null,
      },
    });

    // Emit socket events
    io.to(user.id).emit("task:created", task);
    if (assignedToId) io.to(assignedToId).emit("task:assigned", task);

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
    const user = (req as any).user;
    const { id } = req.params;
    const { title, description, status, priority, dueDate, assignedToId } = req.body;
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isCreator = task.createdById === user.id;
    const isAssigned = task.assignedToId === user.id;

    if (!isCreator && !isAssigned) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const data: any = {};

    if (isCreator) {
      if (title !== undefined) data.title = title;
      if (description !== undefined) data.description = description;
      if (status !== undefined) data.status = status;
      if (priority !== undefined) data.priority = priority;
      if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
      if (assignedToId !== undefined) data.assignedToId = assignedToId || null;
    } else if (isAssigned) {
      if (priority !== undefined) data.priority = priority;
      if (status !== undefined) data.status = status;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    io.to(task.createdById).emit("task:updated", updatedTask);
    if (updatedTask.assignedToId) io.to(updatedTask.assignedToId).emit("task:updated", updatedTask);
    console.log("Backend returned:", updateTask);
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
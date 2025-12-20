import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { io } from "../lib/socket";
import { assignTask } from "../services/taskService";

export const createTask = async (   // creates a new task
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const { title, description, priority, status, dueDate, assignedToId } =
      req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById: user.id,
        assignedToId: assignedToId || null,
      },
    });

    io.to(user.id).emit("task:created", task);   // socket noti for task creation
    if (assignedToId) io.to(assignedToId).emit("task:assigned", task);   // real time notifications for assigned user

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (   // get all tasks associated with current user
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    const tasks = await prisma.task.findMany({   // finds tasks where user is creator or assignee
      where: {
        OR: [{ createdById: user.id }, { assignedToId: user.id }],
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

export const getTaskById = async (   // fetches a specific task
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        OR: [{ createdById: user.id }, { assignedToId: user.id }],
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

export const updateTask = async (   // updates task fields, restricts access based on ownership of this task
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { title, description, status, priority, dueDate, assignedToId } =
      req.body;
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isCreator = task.createdById === user.id;   // is current user the creator
    const isAssigned = task.assignedToId === user.id;   // is current user the assignee

    if (!isCreator && !isAssigned) {   // if neither creator nor assingee, then block access
      return res.status(403).json({ message: "Forbidden" });
    }

    const data: any = {};

    if (isCreator) {   // creator can edit any field
      if (title !== undefined) data.title = title;
      if (description !== undefined) data.description = description;
      if (status !== undefined) data.status = status;
      if (priority !== undefined) data.priority = priority;
      if (dueDate !== undefined)
        data.dueDate = dueDate ? new Date(dueDate) : null;
      if (assignedToId !== undefined) data.assignedToId = assignedToId || null;
    } else if (isAssigned) {   // assignee can only update priority and status
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
    if (updatedTask.assignedToId)
      io.to(updatedTask.assignedToId).emit("task:updated", updatedTask);
    res.status(200).json({ task: updatedTask });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (   // deletes a task
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.createdById !== user.id)   // if not creator then cannot delete
      return res.status(403).json({ message: "Forbidden" });

    const assignedToId = task.assignedToId;
    await prisma.task.delete({ where: { id } });

    io.to(user.id).emit("task:deleted", task);   // notification for task delete

    if (assignedToId) io.to(assignedToId).emit("task:deleted", task);   // notification to assignee if exists

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

export const assignTaskController = async (   // assigns task to a user (used for testing)
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;
    const { assignedToId } = req.body;

    const updatedTask = await assignTask(taskId, assignedToId);

    io.to(assignedToId).emit("task:assigned", updatedTask);

    res.status(200).json({ task: updatedTask });
  } catch (err) {
    next(err);
  }
};

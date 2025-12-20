import { api } from "./api";

export interface TaskCreateInput {
  title: string;
  description?: string;
  dueDate: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  assignedToId?: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  assignedToId?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  assignedToId?: string | null;
  createdById: string;
  assignedTo?: User | null;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await api.get("/tasks");
  return data.tasks;
}

export async function fetchTask(taskId: string): Promise<Task> {
  const { data } = await api.get(`/tasks/${taskId}`);
  return data.task;
}

export async function createTask(input: TaskCreateInput): Promise<Task> {
  const { data } = await api.post("/tasks", input);
  return data;
}

export async function updateTask(
  taskId: string,
  input: TaskUpdateInput
): Promise<Task> {
  const { data } = await api.patch(`/tasks/${taskId}`, input);
  return data.task;
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/tasks/${taskId}`);
}

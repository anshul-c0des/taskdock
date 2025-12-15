import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().min(1),
  assignedToId: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

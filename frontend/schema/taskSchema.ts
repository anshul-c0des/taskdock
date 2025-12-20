import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().trim().min(3, "Title is required"),
  description: z.string().optional(),
  dueDate: z
    .string()
    .min(1, "Due date is required")   // date is req
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")   // format matching using regex
    .refine((value) => {   // refines for invalid date
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    }, "Invalid calendar date")
    .refine((value) => {   // refines for past dates
      const [year, month, day] = value.split("-").map(Number);
      const selected = new Date(year, month - 1, day);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selected >= today;
    }, "Due date cannot be in the past"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
  assignedToId: z.string().optional(),
  assignedUser: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

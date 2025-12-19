import { Task } from "@/lib/taskApi";

export function selectTasks({
  tasks,
  tab,
  userId,
  filters,
}: {
  tasks: Task[];
  tab: "assigned" | "created" | "overdue";
  userId: string;
  filters: any;
}) {
  let result = [...tasks];

  if (tab === "assigned") {
    result = result.filter((t) => t.assignedToId === userId);
  }

  if (tab === "created") {
    result = result.filter((t) => t.createdById === userId);
  }

  if (tab === "overdue") {
    const now = new Date();
    result = result.filter(
      (t) =>
        new Date(t.dueDate) < now &&
        t.status !== "COMPLETED"
    );
  }

  if (filters.status && filters.status !== "ALL") {
    result = result.filter((t) => t.status === filters.status);
  }

  if (filters.priority && filters.priority !== "ALL") {
    result = result.filter((t) => t.priority === filters.priority);
  }

  if (filters.sort === "due_asc") {
    result.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  if (filters.sort === "due_desc") {
    result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return result;
}

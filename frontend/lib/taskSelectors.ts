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
        t.status !== "DONE"
    );
  }

  if (filters.status) {
    result = result.filter((t) => t.status === filters.status);
  }

  if (filters.sort === "due_asc") {
    result.sort(
      (a, b) =>
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime()
    );
  }

  if (filters.sort === "due_desc") {
    result.sort(
      (a, b) =>
        new Date(b.dueDate).getTime() -
        new Date(a.dueDate).getTime()
    );
  }

  return result;
}

import toast from "react-hot-toast";
import { getSocket } from "./socket";
import { Task } from "@/lib/taskApi";
import { QueryClient } from "@tanstack/react-query";

function isUserInvolved(task: Task, userId: string) {   // function to check whether user in involved (creator or assignee)
  const isCreator = task.createdById === userId;
  const isAssignee = task.assignedToId === userId;
  return { isCreator, isAssignee };
}

export function registerSocketHandlers(
  userId: string,
  queryClient: QueryClient
) {
  const socket = getSocket();
  if (!socket) return;

  const qc = queryClient;

  ["task:created", "task:assigned", "task:updated", "task:deleted"].forEach(
    (event) => socket.off(event)
  );

  const updateTaskList = (task: Task, updater: (old: Task[]) => Task[]) => {
    if (!task || !task.id) {
      console.warn("Received invalid task payload:", task);
      return;
    }
    qc.setQueryData<Task[]>(["tasks"], (old) => updater(old || []));
  };

  socket.on("task:created", (task: Task) => {   // sends notification to assingee when someone creates a new task involving them
    updateTaskList(task, (old) => {
      const { isCreator, isAssignee } = isUserInvolved(task, userId);
      if (!isCreator && !isAssignee) return old;
      if (old.some((t) => t?.id === task?.id)) return old;
      if (isAssignee && !isCreator) {
        toast.success(
          `You were assigned ${task.title} task by: ${task.assignedTo?.name}`
        );
      }
      return [task, ...old];
    });
  });

  socket.on("task:assigned", (task: Task) => {   // sends when someone assigns task to them
    if (!task || task.assignedToId !== userId) return;
    updateTaskList(task, (old) => {
      if (old.some((t) => t?.id === task?.id)) return old;
      toast.success(
        `You were assigned ${task.title} task by: ${task.assignedTo?.name}`
      );
      return [task, ...old];
    });
  });

  socket.on("task:updated", (task: Task) => {   // task update noti
    updateTaskList(task, (old) => {
      const { isCreator, isAssignee } = isUserInvolved(task, userId);
      if (!isCreator && !isAssignee) return old;
      const updated = old.map((t) => (t?.id === task?.id ? task : t));
      if (isAssignee && !isCreator) {
        toast(`Task updated: ${task.title}`, { icon: "✏️" });
      }
      return updated;
    });
  });

  socket.on("task:deleted", (task: Task) => {   // task delete noti
    updateTaskList(task, (old) => {
      const { isCreator, isAssignee } = isUserInvolved(task, userId);
      if (!isCreator && !isAssignee) return old;
      const filtered = old.filter((t) => t?.id !== task?.id);
      if (isAssignee || !isCreator) {
        toast(`Task deleted: ${task.title}`, { icon: "🗑️" });
      }
      return filtered;
    });
  });
}

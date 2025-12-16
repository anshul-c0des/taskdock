import toast from "react-hot-toast";
import { getSocket } from "./socket";
import { Task } from "@/lib/taskApi";
import { QueryClient } from "@tanstack/react-query";

export function registerSocketHandlers(userId: string) {
  const socket = getSocket();
  const queryClient = new QueryClient();

  // 🚨 Prevent duplicate listeners
  socket.off("task:created");
  socket.off("task:assigned");
  socket.off("task:updated");
  socket.off("task:deleted");

  // ➕ Task created
  socket.on("task:created", (task: Task) => {
    queryClient.setQueryData<Task[]>(["tasks"], (old = []) => {
      // avoid duplicates
      if (old.some(t => t.id === task.id)) return old;
      return [task, ...old];
    });

    toast.success(`Task created: ${task.title}`);
  });

  // 👤 Task assigned to you
  socket.on("task:assigned", (task: Task) => {
    if (task.assignedTo?.id !== userId) return;

    queryClient.setQueryData<Task[]>(["tasks"], (old = []) => {
      if (old.some(t => t.id === task.id)) return old;
      return [task, ...old];
    });

    toast.success(`You were assigned: ${task.title}`);
  });

  // ✏️ Task updated
  socket.on("task:updated", (task: Task) => {
    queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
      old.map(t => (t.id === task.id ? task : t))
    );

    toast(`Task updated: ${task.title}`, { icon: "✏️" });
  });

  // 🗑️ Task deleted
  socket.on("task:deleted", (task: Task) => {
    queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
      old.filter(t => t.id !== task.id)
    );

    toast(`Task deleted: ${task.title}`, { icon: "🗑️" });
  });
}

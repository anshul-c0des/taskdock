import toast from "react-hot-toast";
import { getSocket } from "./socket";

export function registerSocketHandlers(userId: string) {
  const socket = getSocket();

  socket.on("task:assigned", (task) => {
    if (task.assignedTo?.id === userId) {
      toast.success(`You were assigned: ${task.title}`);
    }
  });
}

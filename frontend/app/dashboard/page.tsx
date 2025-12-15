"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTasks } from "@/hooks/useTasks";
import { getSocket } from "@/lib/socket";
import { Task } from "@/lib/taskApi";

export default function DashboardPage() {
  const { data: tasks, isLoading, isError, refetch } = useTasks();
  
  useEffect(() => {
    const socket = getSocket();

    socket.on("task:created", () => refetch());
    socket.on("task:updated", () => refetch());
    socket.on("task:deleted", () => refetch());

    return () => {
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
    };
  }, [refetch]);

  {isLoading && <p>Loading...</p>}
  if (isError)
    return <p className="text-sm text-destructive">Failed to load tasks.</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">My Tasks</h1>

      {tasks?.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tasks yet. Create your first task.
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks?.map((task) => (
            <Link key={task.id} href={`/dashboard/tasks/${task.id}`}>
              <li className="border rounded-lg p-4 hover:bg-accent cursor-pointer">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground">
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {task.status}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}

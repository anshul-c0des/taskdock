"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useTasks();

  if (!user) return <p>Loading user...</p>;
  if (isLoading) return <p>Loading tasks...</p>;

  // Task stats
  const pending = tasks.filter((t) => (t.assignedTo?.id === user.id || t.createdBy.id===user.id) && t.status === "PENDING").length;
  const inProgress = tasks.filter((t) => (t.assignedTo?.id === user.id || t.createdBy.id===user.id) && t.status === "IN_PROGRESS").length;
  const completed = tasks.filter((t) => (t.assignedTo?.id === user.id || t.createdBy.id===user.id) && t.status === "COMPLETED").length;

  // Recent 5 tasks (assigned or created by user)
  const recentTasks = tasks
    .filter((t) => t.assignedTo?.id === user.id || t.createdBy.id === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-lg font-medium">{pending}</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-lg font-medium">{inProgress}</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-lg font-medium">{completed}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Tasks</h3>
        {recentTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent tasks.</p>
        ) : (
          <ul className="space-y-2">
            {recentTasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <li className="border rounded p-3 hover:bg-accent cursor-pointer">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: {task.status.replace("_", " ")}
                  </p>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

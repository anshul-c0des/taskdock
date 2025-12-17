"use client";

import { useState } from "react";
import Link from "next/link";
import { useTasks } from "@/hooks/useTasks";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { TaskFilters } from "@/components/dashboard/TaskFilters";
import { selectTasks } from "@/lib/taskSelectors";
import { useAuth } from "@/hooks/useAuth";

type Filters = {
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ALL";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "ALL";
  sort?: "due_asc" | "due_desc";
};

export default function DashboardPage() {
  const { data: tasks = [], isLoading } = useTasks();
  const {user, isInitializing } = useAuth();
  const [tab, setTab] = useState<"assigned" | "created" | "overdue">("assigned");
  const [filters, setFilters] = useState<Filters>({});

  if(isInitializing || !user) return null;
  const userId = user.id;

  if (isLoading) return <p>Loading...</p>;

  const visibleTasks = selectTasks({
    tasks,
    tab,
    userId,
    filters,
  });

  return (
    <div>
      <DashboardTabs active={tab} onChange={setTab} />
      <TaskFilters onChange={(f) => setFilters({ ...filters, ...f })} />

      {visibleTasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tasks found.
        </p>
      ) : (
        <ul className="space-y-3">
          {visibleTasks.map((task) => (
            <Link key={task.id} href={`/dashboard/tasks/${task.id}`}>
              <li className="border rounded-lg p-4 hover:bg-accent">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground">
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}

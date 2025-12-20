"use client";

import { useState } from "react";
import Link from "next/link";
import { useTasks } from "@/hooks/useTasks";
import { TaskFilters } from "@/components/dashboard/TaskFilters";
import { selectTasks } from "@/lib/taskSelectors";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Calendar, User, Clock, ChevronRight, Inbox } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { SkeletonLoader } from "@/components/SkeletonLoader";

type Filters = {
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ALL";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "ALL";
  sort?: "due_asc" | "due_desc";
};

const PriorityBadge = ({ priority }: { priority: string }) => {   // custom badge for priorities
  const styles =
    {
      HIGH: "bg-orange-50 text-orange-600 border-orange-100",
      MEDIUM: "bg-yellow-50 text-yellow-600 border-yellow-100",
      LOW: "bg-emerald-50 text-emerald-600 border-emerald-100",
      URGENT: "bg-red-50 text-red-600 border-red-100",
    }[priority] || "bg-slate-50 text-slate-600 border-slate-100";

  return (
    <span
      className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
        styles
      )}
    >
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {   // custom badge for status
  const styles =
    {
      COMPLETED: "bg-indigo-50 text-indigo-600",
      IN_PROGRESS: "bg-blue-50 text-blue-600",
      PENDING: "bg-slate-100 text-slate-500",
    }[status] || "bg-slate-100 text-slate-500";

  return (
    <span
      className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tighter",
        styles
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default function DashboardPage() {
  const { data: tasks = [], isLoading } = useTasks();   // get all tasks
  const { user, isInitializing } = useAuth();   // gets current user
  const [filters, setFilters] = useState<Filters>({});   // filter state
  const searchParams = useSearchParams();   // for tab navigation
  const tab = (searchParams.get("tab") ?? "assigned") as
    | "assigned"
    | "created"
    | "overdue";

  if (isInitializing || !user){
    redirect('/auth/login');
  }
  const userId = user.id;

  if (isLoading) {
    return <SkeletonLoader />;
  }

  const visibleTasks = selectTasks({ tasks, tab, userId, filters });   // for filtering

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <div className="space-y-4">

        {/* Filters */}
        <TaskFilters onChange={(f) => setFilters({ ...filters, ...f })} />
          
        <div className="flex items-center gap-2 px-1 pb-2 ml-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <p className="text-slate-500 text-sm font-medium ml-1">
            You have{" "}
            <span className="text-[#6366F1] font-bold">
              {visibleTasks.length} {tab}{" "}
              {visibleTasks.length === 1 ? "task" : "tasks"}
            </span>{" "}
            to manage.
          </p>
        </div>

        {visibleTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <Inbox className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-400 font-medium tracking-tight">
              No tasks found matching your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {visibleTasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`} className="group">
                <div
                  className={`bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 transition-all duration-300 relative overflow-hidden`}
                >
                  <div
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-1.5",
                      task.priority === "URGENT"
                        ? "bg-red-500"
                        : task.priority === "HIGH"
                        ? "bg-orange-400"
                        : task.priority === "MEDIUM"
                        ? "bg-yellow-400"
                        : "bg-emerald-400"
                    )}
                  />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                    <div className="space-y-1 md:space-y-2 flex-1">
                      <div className="flex items-center gap-2 md:gap-3">
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                      </div>

                      <h3 className="text-base md:text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 max-w-full md:max-w-2xl">
                        {task.description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4 sm:gap-y-2 pt-1">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-[12px]">
                          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600" />
                          <span className="font-medium">
                            Due{" "}
                            {new Date(task.dueDate).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "2-digit",
                              }
                            )}
                          </span>
                        </div>

                        <div className="text-slate-600 pb-1.5">|</div>

                        {task.assignedToId === user.id && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-[12px] truncate">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                            <span className="font-medium">
                              Assigned by: {task.createdBy?.name}
                            </span>
                          </div>
                        )}

                        {task.createdById === user.id && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-[12px] truncate">
                            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                            <span className="font-medium">
                              Created by: {task.createdBy?.name}
                            </span>
                          </div>
                        )}

                        <div className="text-slate-600 pb-1.5">|</div>

                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-[12px]">
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-500" />
                          <span className="font-medium">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end mt-2 md:mt-0">
                      <div className="p-1.5 md:p-2 bg-slate-50 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

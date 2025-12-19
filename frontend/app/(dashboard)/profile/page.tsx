"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  CircleDot, 
  Clock, 
  Mail, 
  CalendarDays, 
  ChevronRight,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useTasks();

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const userTasks = tasks.filter(
    (t) => t.assignedTo?.id === user.id || t.createdBy.id === user.id
  );

  const stats = [
    { label: "Pending", count: userTasks.filter((t) => t.status === "PENDING").length, icon: Clock, color: "text-slate-500", bg: "bg-slate-50" },
    { label: "In Progress", count: userTasks.filter((t) => t.status === "IN_PROGRESS").length, icon: CircleDot, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Completed", count: userTasks.filter((t) => t.status === "COMPLETED").length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const recentTasks = [...userTasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-10">
      
      <section className="flex flex-col md:flex-row items-center gap-4 md:gap-8 p-6 md:p-10 bg-white border border-slate-200 rounded-2xl md:rounded-[2rem] shadow-sm">
        <Avatar className="h-20 w-20 md:h-28 md:w-28 border-4 border-indigo-50 shadow-sm">
          <AvatarFallback className="bg-[#6366F1] text-white text-xl md:text-3xl font-bold">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center md:text-left flex flex-col gap-2">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            {user.name}
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 text-slate-500">
            <span className="flex items-center gap-1.5 text-xs md:text-sm font-medium">
              <Mail className="w-4 h-4 text-indigo-400" /> {user.email}
            </span>
          </div>
        </div>
      </section>

      {/* Stats Grid - 2 columns on small, 3 on larger */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {stats.map((stat, idx) => (
          <Card 
            key={stat.label} 
            className={cn(
              "border-slate-200 shadow-none rounded-2xl overflow-hidden",
              idx === 2 ? "col-span-2 md:col-span-1" : "col-span-1" // Make 3rd card wide on mobile
            )}
          >
            <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-center sm:justify-between gap-3 text-center sm:text-left">
              <div className="order-2 sm:order-1">
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                  {stat.label}
                </p>
                <p className={cn("text-2xl md:text-4xl font-black", stat.color)}>
                  {stat.count}
                </p>
              </div>
              <div className={cn("p-2.5 md:p-3 rounded-xl order-1 sm:order-2", stat.bg)}>
                <stat.icon className={cn("w-5 h-5 md:w-7 md:h-7", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-1">Overview</p>
            <h3 className="text-lg md:text-xl font-bold text-slate-900">Recent Activity</h3>
          </div>
          <Link href="/dashboard" className="text-xs md:text-sm font-bold text-indigo-600 hover:underline underline-offset-4">
            View All
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-sm text-slate-400 font-medium">No task activity yet.</p>
          </div>
        ) : (
          <div className="grid gap-2 md:gap-3">
            {recentTasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`} className="block group">
                <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl group-hover:border-indigo-300 group-hover:shadow-md transition-all active:scale-[0.98]">
                  <div className="flex flex-col gap-1.5 overflow-hidden">
                    <span className="font-bold text-slate-800 text-sm md:text-base truncate">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[9px] font-black px-1.5 py-0 bg-slate-100 text-slate-500 border-none uppercase">
                        {task.status.replace("_", " ")}
                      </Badge>
                      <span className="text-[10px] md:text-xs font-medium text-slate-400">
                        {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:block text-[10px] font-bold text-slate-300 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Task
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
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
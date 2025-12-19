"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, LogOut, User, LayoutDashboard, Bell } from "lucide-react";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { getSocket } from "@/lib/socket";

type Notification = {
  id: string;
  type: "assigned" | "updated" | "deleted" | "created";
  taskTitle: string;
  taskId: string;
  timestamp: number;
  read?: boolean;
};

export default function Header() {
  const { user, logoutUser } = useAuth();
  const firstLetter = user?.name?.[0]?.toUpperCase() ?? "U";
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    setNotifications(prev => {
      const newNotification: Notification = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        read: false,
        ...notification
      };
      return [newNotification, ...prev].slice(0, 10);
    });
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Socket integration
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user) return;

    const handleEvent = (task: any, type: Notification["type"]) => {
      if (!task) return;
      const isUserInvolved = task.createdById === user.id || task.assignedToId === user.id;
      if (!isUserInvolved) return;

      addNotification({ type, taskTitle: task.title, taskId: task.id });

      if (type === "assigned" && task.assignedToId === user.id) toast.success(`You were assigned: ${task.title}`);
      if (type === "updated") toast(`Task updated: ${task.title}`, { icon: "✏️" });
      if (type === "deleted") toast(`Task deleted: ${task.title}`, { icon: "🗑️" });
    };

    socket.on("task:assigned", (task) => handleEvent(task, "assigned"));
    socket.on("task:updated", (task) => handleEvent(task, "updated"));
    socket.on("task:deleted", (task) => handleEvent(task, "deleted"));

    return () => {
      [ "task:assigned", "task:updated", "task:deleted"].forEach(event =>
        socket.off(event)
      );
    };
  }, [user]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
    toast.success("Logged out successfully");
  };

  return (
    <>
      <header className="relative md:sticky top-0 z-50 w-full bg-white md:bg-white/90 md:backdrop-blur-md border-b border-slate-200">
        <div className="h-16 px-4 md:px-12 lg:px-20 max-w-[1440px] mx-auto flex items-center justify-between gap-3">
          
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
            <div className="bg-[#6366F1] p-2 rounded-xl shadow-lg shadow-indigo-100">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
              TaskDock
            </span>
          </Link>

          {isDashboard && (
            <div className="hidden md:flex flex-1 justify-center max-w-md mx-auto mt-3">
              <DashboardTabs />
            </div>
          )}

          <div className="flex items-center gap-3 shrink-0">
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="relative">
                <Bell className="w-6 h-6 text-slate-700 hover:text-indigo-600 transition-colors" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-1 rounded-2xl shadow-2xl border bg-white max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="px-3 py-2 font-bold">Notifications</DropdownMenuLabel>
                {notifications.length === 0 && <div className="px-3 py-2 text-sm text-slate-500">No notifications</div>}
                {notifications.map(n => (
                  <DropdownMenuItem
                    key={n.id}
                    asChild
                    onClick={markAllRead}
                    className={`flex flex-col gap-0.5 py-2 px-3 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors ${!n.read ? "bg-indigo-50" : ""}`}
                  >
                    <Link href={`/tasks/${n.taskId}`}>
                      <span className="text-sm font-medium text-slate-900">{n.taskTitle}</span>
                      <span className="text-xs text-slate-500">{n.type.toUpperCase()} - {new Date(n.timestamp).toLocaleTimeString()}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/tasks/create" className="hidden md:block">
              <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl px-5 h-10 text-sm font-semibold transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </Link>

            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-slate-200 hover:border-indigo-300 transition-colors">
                  <AvatarFallback className="bg-indigo-50 text-[#6366F1] font-bold">{firstLetter}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-2xl mt-2 shadow-2xl border-slate-100 bg-white">
                <DropdownMenuLabel className="font-normal px-3 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                    <span className="text-xs text-slate-500 truncate">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer py-2.5 rounded-xl gap-3 text-slate-600 focus:text-indigo-600 focus:bg-indigo-50 transition-colors">
                  <User className="w-4 h-4" /> <span className="font-medium text-sm">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2.5 rounded-xl gap-3 text-red-600 focus:bg-red-50 focus:text-red-600 transition-colors">
                  <LogOut className="w-4 h-4" /> <span className="font-medium text-sm">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </header>

      {isDashboard && (
        <div className="md:hidden w-full border-b border-slate-100 px-4 pt-1">
          <DashboardTabs />
        </div>
      )}
    </>
  );
}

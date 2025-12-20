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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, LogOut, User, LayoutDashboard, Bell, Loader2 } from "lucide-react";
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
  const { user, logoutUser } = useAuth();   // get current user and logout current user from useAuth hook
  const firstLetter = user?.name?.[0]?.toUpperCase() ?? "U";   // first letter of current user name

  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";   // for tabs

  const [notifications, setNotifications] = useState<Notification[]>([]);   // for notifications

  const addNotification = (   // adds a new notification
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => {
    setNotifications((prev) => {
      const newNotification: Notification = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        read: false,
        ...notification,
      };
      return [newNotification, ...prev].slice(0, 10);
    });
  };

  const markAllRead = () => {   // marks all notification as read
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {   // socket init for current user
    const socket = getSocket();
    if (!socket || !user) return;

    const handleEvent = (task: any, type: Notification["type"]) => {
      if (!task) return;
      const isUserInvolved =
        task.createdById === user.id || task.assignedToId === user.id;
      if (!isUserInvolved) return;

      addNotification({ type, taskTitle: task.title, taskId: task.id });

      if (type === "assigned" && task.assignedToId === user.id)
        toast.success(`You were assigned: ${task.title}`);
      if (type === "updated" && task.assignedToId === user.id)
        toast(`Task updated: ${task.title}`, { icon: "✏️" });
      if (type === "deleted" && task.assignedToId === user.id)
        toast(`Task deleted: ${task.title}`, { icon: "🗑️" });
    };

    socket.on("task:assigned", (task) => handleEvent(task, "assigned"));
    socket.on("task:updated", (task) => handleEvent(task, "updated"));
    socket.on("task:deleted", (task) => handleEvent(task, "deleted"));

    return () => {
      ["task:assigned", "task:updated", "task:deleted"].forEach((event) =>
        socket.off(event)
      );
    };
  }, [user]);

  const handleLogout = async () => {   // logs out current user
    await logoutUser();
    router.replace("/");
    router.refresh();
    toast.success("Logged out successfully");
  };

  return (
    <>
      <header className="relative md:sticky top-0 z-50 w-full bg-white md:bg-white/90 md:backdrop-blur-md border-b border-slate-200">
        <div className="h-16 px-4 md:px-12 lg:px-20 max-w-[1440px] mx-auto flex items-center justify-between gap-3">

          {/* LHS */}
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
            <div className="bg-[#6366F1] p-2 rounded-xl shadow-lg shadow-indigo-100">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
              TaskDock
            </span>
          </Link>

          {/* MID- shows tabs in header for large screens */}
          {isDashboard && (
            <div className="hidden md:flex flex-1 justify-center max-w-md mx-auto -mt-4">
              <DashboardTabs />
            </div>
          )}

          {/* Notifications Bell */}
          <div className="flex items-center gap-3 shrink-0">
            <DropdownMenu onOpenChange={(open) => open && markAllRead()}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-slate-200 cursor-pointer rounded-full transition-all group bg-indigo-100/40"
                >
                  <Bell className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-all" />
                  {notifications.some((n) => !n.read) && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-80 p-1.5 rounded-2xl shadow-xl border border-slate-200 bg-white"
              >
                <div className="flex items-center justify-between px-3 py-2 mb-1">
                  <DropdownMenuLabel className="p-0 font-semibold text-slate-900">
                    Notifications
                  </DropdownMenuLabel>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {notifications.length} Total
                  </span>
                </div>

                <div className="max-h-[380px] overflow-y-auto overflow-x-hidden space-y-1">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-sm text-slate-400">All caught up!</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <DropdownMenuItem
                        key={n.id}
                        asChild
                        className="flex items-start gap-3 p-3 rounded-xl cursor-pointer focus:bg-slate-50 transition-colors border border-transparent"
                      >
                        <Link href={`/tasks/${n.taskId}`}>
                          <div className="mt-1.5 shrink-0">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                !n.read ? "bg-indigo-600" : "bg-slate-200"
                              }`}
                            />
                          </div>

                          <div className="flex flex-col gap-1 overflow-hidden">
                            <span
                              className={`text-sm leading-none truncate ${
                                !n.read
                                  ? "font-semibold text-slate-900"
                                  : "text-slate-600"
                              }`}
                            >
                              {n.taskTitle}
                            </span>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[11px] px-1.5 py-0.5 rounded-md font-medium uppercase tracking-tight
                      ${
                        n.type === "assigned"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                              >
                                {n.type}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                {new Date(n.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Create Task Button hidden on smaller devices */}
            <Link href="/tasks/create" className="hidden md:block">
              <Button className="bg-indigo-100/50 hover:bg-primary cursor-pointer hover:text-white text-primary rounded-xl px-5 h-10 text-md font-semibold transition-all">
                <Plus className="w-5 h-5" />
                Create Task
              </Button>
            </Link>

            {/* User Avatarr */}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-9 w-9 cursor-pointer md:h-10 md:w-10 border border-slate-200 hover:border-indigo-300 transition-colors">
                  <AvatarFallback className="bg-indigo-50 text-[#6366F1] font-bold">
                    {firstLetter === "U" ? <Loader2 className="w-5 h-5 animate-spin text-indigo-500" /> : firstLetter}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 p-1.5 rounded-2xl mt-2 shadow-2xl border-slate-100 bg-white"
              >
                <DropdownMenuLabel className="font-normal px-3 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-slate-900">
                      {user?.name}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer py-2.5 rounded-xl gap-3 text-slate-600 focus:text-indigo-600 focus:bg-indigo-50 transition-colors"
                >
                  <User className="w-4 h-4" />{" "}
                  <span className="font-medium text-sm">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer py-2.5 rounded-xl gap-3 text-red-600 focus:bg-red-50 focus:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />{" "}
                  <span className="font-medium text-sm">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Tabs for smaller devices */}
      {isDashboard && (
        <div className="md:hidden w-full border-b border-slate-100 px-4 pt-1">
          <DashboardTabs />
        </div>
      )}
    </>
  );
}

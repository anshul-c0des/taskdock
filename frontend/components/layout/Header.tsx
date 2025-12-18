"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, LogOut, User, LayoutDashboard } from "lucide-react";

export default function Header() {
  const { user, logoutUser } = useAuth();
  const firstLetter = user?.name?.[0]?.toUpperCase() ?? "U";
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
    toast.success("Logged out successfully");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/40 backdrop-blur-lg border-b border-slate-200/50">
      <div className="h-16 px-4 md:px-10 lg:px-16 flex items-center justify-between max-w-[1600px] mx-auto">

        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="bg-[#6366F1] p-1.5 rounded-lg shadow-sm group-hover:shadow-indigo-200 transition-all">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#0F172A] hidden sm:block">
            TaskDock
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/tasks/create">
            <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-sm hover:shadow-md rounded-xl h-10 px-4 text-sm font-semibold transition-all flex items-center gap-2">
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span className="hidden xs:inline-block sm:block">Create Task</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-transparent hover:ring-[#6366F1]/30 transition-all border border-white/50 shadow-sm">
                <AvatarFallback className="bg-indigo-50 text-[#6366F1] font-bold text-lg">
                  {firstLetter}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-60 p-1.5 rounded-2xl shadow-xl border-slate-200/60 bg-white/95 backdrop-blur-xl">
              <DropdownMenuLabel className="px-3 py-1">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold text-primary">{user?.name}</p>
                  <p className="text-xs font-medium text-slate-500 truncate">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mx-1 bg-slate-100" />
              
              <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer gap-2.5 py-2.5 rounded-xl focus:bg-indigo-50 focus:text-[#6366F1] transition-colors">
                <User className="w-4 h-4" /> 
                <span className=" text-xs font-medium">Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="mx-1 bg-slate-100" />
              
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer gap-2.5 py-2.5 rounded-xl text-red-600 focus:bg-red-50 focus:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" /> 
                <span className="text-xs font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { user, logoutUser } = useAuth();
  const firstLetter = user?.name?.[0]?.toUpperCase() ?? "U";
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-background border-b">
      <div className="h-14 px-4 max-w-5xl mx-auto flex items-center justify-between">
        <span className="font-semibold text-sm">TaskDock</span>

        <div className="flex items-center gap-4">
          <Link href="/tasks/create">
            <Button>Create Task</Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback>{firstLetter}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

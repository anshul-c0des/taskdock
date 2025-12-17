"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { user, logoutUser } = useAuth();
  const firstLetter = user?.name?.[0]?.toUpperCase() ?? "U";
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  }
  return (
    <header className="sticky top-0 z-40 bg-background border-b">
      <div className="h-14 px-4 max-w-5xl mx-auto flex items-center justify-between">
        <span className="font-semibold text-sm">TaskDock</span>
        <Button onClick={handleLogout}>Logout</Button>
        <Link href="/profile">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
        </Link>
      </div>
    </header>
  );
}

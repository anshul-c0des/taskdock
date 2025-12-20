"use client";

import { ReactNode, useEffect } from "react";
import MobileNav from "@/components/layout/MobileNav";
import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { registerSocketHandlers } from "@/lib/socketHandler";
import { useAuth } from "@/hooks/useAuth";
import { connectSocket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isInitializing } = useAuth();   // user and init user
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {   // fetch user on mount, else redirect to login
    if (!isInitializing && !user) {
      router.replace("/auth/login");
      router.refresh();
    } else if (user) {
      connectSocket(user.id);
      registerSocketHandlers(user.id, queryClient);
    }
  }, [user, router, isInitializing, queryClient]);

  if (isInitializing || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 pb-20 max-w-5xl mx-auto">{children}</main>

      <MobileNav />
    </div>
  );
}

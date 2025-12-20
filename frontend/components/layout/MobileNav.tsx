"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Plus, User, LayoutDashboard } from "lucide-react";

export default function MobileNav() {   // Bottom Mobile-only navigation menu
  const pathname = usePathname();

  const navItems = [
    {
      label: "DashBoard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Create",
      href: "/tasks/create",
      icon: Plus,
      isPrimary: true,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden">
      <div className="bg-white/80 backdrop-blur-lg border-t border-slate-200/50 pb-safe shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.05)]">
        <ul className="flex items-center justify-around h-16">
          {navItems.map(({ href, icon: Icon, label, isPrimary }) => {
            const active = pathname === href;

            if (isPrimary) {   // styling for create task button
              return (
                <li key={href} className="relative -top-4">
                  <Link
                    href={href}
                    className="flex flex-col items-center justify-center"
                  >
                    <div className="bg-[#6366F1] h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 active:scale-90 transition-transform border-4 border-[#F9FAFB]">
                      <Plus className="h-6 w-6 stroke-[3px]" />
                    </div>
                    <span className="text-[10px] font-bold text-[#6366F1] mt-1 uppercase tracking-tighter">
                      {label}
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 transition-all duration-200",
                    active ? "scale-110" : "opacity-70"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 mb-1",
                      active ? "text-[#6366F1]" : "text-slate-500"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-semibold tracking-wide",
                      active ? "text-[#0F172A]" : "text-slate-400"
                    )}
                  >
                    {label}
                  </span>
                  {active && (
                    <div className="absolute bottom-1 w-1 h-1 bg-[#6366F1] rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Plus, ListTodo, User } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Tasks",
      href: "/dashboard",
      icon: ListTodo,
    },
    {
      label: "Create",
      href: "/tasks/create",
      icon: Plus,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-background md:hidden">
      <ul className="flex justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 text-xs",
                  active
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

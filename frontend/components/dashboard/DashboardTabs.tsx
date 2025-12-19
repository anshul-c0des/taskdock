"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, ListTodo } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Tab = "assigned" | "created" | "overdue";

export function DashboardTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const active = (searchParams.get("tab") ?? "assigned") as Tab;

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "assigned", label: "Assigned", icon: ListTodo },
    { key: "created", label: "Created", icon: CheckCircle2 },
    { key: "overdue", label: "Overdue", icon: AlertCircle },
  ];

  const handleChange = (tab: Tab) => {
    router.push(`/dashboard?tab=${tab}`);
  };

  return (
    <div className="flex justify-center w-full px-4 mt-4">
      <div className="inline-flex items-center p-1 bg-indigo-100/40 rounded-2xl w-full max-w-[450px]">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => handleChange(tab.key)}
              className={cn(
                "relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 cursor-pointer text-sm font-semibold rounded-xl transition-all duration-200 ease-in-out",
                isActive
                  ? "bg-white text-indigo-600 shadow-md shadow-indigo-100"
                  : "text-slate-500 hover:text-primary hover:bg-indigo-100/50"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 hover:text-indigo-600",
                  isActive ? "text-indigo-600" : "text-slate-400"
                )}
              />
              <span className="hidden sm:inline">{tab.label}</span>

              {isActive && (
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

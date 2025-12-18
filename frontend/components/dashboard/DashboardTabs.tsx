"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, ListTodo } from "lucide-react";

type Tab = "assigned" | "created" | "overdue";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
  counts?: Record<Tab, number>;
}

export function DashboardTabs({ active, onChange, counts = { assigned: 0, created: 0, overdue: 0 } }: Props) {
  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "assigned", label: "Assigned", icon: ListTodo },
    { key: "created", label: "Created", icon: CheckCircle2 },
    { key: "overdue", label: "Overdue", icon: AlertCircle },
  ];

  return (
    <div className="flex justify-center w-full px-4 mb-7 mt-4">
      <div className="inline-flex items-center p-1 sm:p-1.5 bg-slate-200/40 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm w-full max-w-[450px] sm:w-auto">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={cn(
                "relative flex items-center justify-center flex-1 sm:flex-none gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl",
                isActive
                  ? "bg-white text-[#6366F1] shadow-md shadow-indigo-100/40 translate-y-[-1px]"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/30"
              )}
            >
              <Icon className={cn("w-4 h-4 transition-colors shrink-0", isActive ? "text-[#6366F1]" : "text-slate-400")} />
              
              <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>

              {counts[tab.key] > 0 && (
                <span className={cn(
                  "flex h-4.5 sm:h-5 min-w-[18px] sm:min-w-[20px] items-center justify-center rounded-full px-1 sm:px-1.5 text-[9px] sm:text-[10px] font-bold tabular-nums transition-all",
                  isActive 
                    ? "bg-indigo-50 text-[#6366F1]" 
                    : "bg-slate-200/80 text-slate-600",
                  tab.key === "overdue" && !isActive && "bg-red-50 text-red-500 animate-pulse"
                )}>
                  {counts[tab.key]}
                </span>
              )}

              {isActive && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#6366F1] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
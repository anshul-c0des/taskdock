"use client";

import { cn } from "@/lib/utils";

type Tab = "assigned" | "created" | "overdue";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function DashboardTabs({ active, onChange }: Props) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "assigned", label: "Assigned" },
    { key: "created", label: "Created" },
    { key: "overdue", label: "Overdue" },
  ];

  return (
    <div className="flex border rounded-lg overflow-hidden mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "flex-1 py-2 text-sm",
            active === tab.key
              ? "bg-primary text-primary-foreground"
              : "bg-background"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

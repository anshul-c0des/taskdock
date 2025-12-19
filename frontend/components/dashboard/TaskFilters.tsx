"use client";

import * as React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  ArrowUpDown, 
  CircleDot, 
  ShieldAlert,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onChange: (filters: any) => void;
}

export function TaskFilters({ onChange }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full px-4 mb-6">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">

          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer sm:cursor-default w-fit">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#6366F1]" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 whitespace-nowrap">
                  Filter By
                </span>
              </div>

              <ChevronDown className={cn(
                "h-4 w-4 text-slate-400 transition-transform duration-300 sm:hidden",
                isOpen ? "rotate-180" : ""
              )} />
            </div>
          </CollapsibleTrigger>

          <div className="hidden sm:block">
            <FilterBar onChange={onChange} />
          </div>
        </div>

        <CollapsibleContent className="sm:hidden">
          <div className="pt-4">
            <FilterBar onChange={onChange} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function FilterBar({ onChange }: { onChange: (filters: any) => void }) {
  return (
    <div className="flex flex-col sm:flex-row items-center bg-indigo-100/20 backdrop-blur-md p-1 rounded-2xl w-full sm:w-fit">
      <Select onValueChange={(value) => onChange({ status: value })}>
        <SelectTrigger className="w-full sm:w-[145px] h-9 border-none bg-transparent hover:bg-white/60 rounded-xl focus:ring-0 focus:ring-offset-0 transition-all shadow-none px-4 text-slate-600">
          <div className="flex items-center gap-2.5">
            <CircleDot className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="text-sm font-medium"><SelectValue placeholder="Status" /></span>
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
        </SelectContent>
      </Select>

      <div className="hidden sm:block w-[1px] h-4 bg-slate-300/60 mx-1" />

      <Select onValueChange={(value) => onChange({ priority: value })}>
        <SelectTrigger className="w-full sm:w-[145px] h-9 border-none bg-transparent hover:bg-white/60 rounded-xl focus:ring-0 focus:ring-offset-0 transition-all shadow-none px-4 text-slate-600">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="text-sm font-medium"><SelectValue placeholder="Priority" /></span>
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
          <SelectItem value="ALL">All Priorities</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
        </SelectContent>
      </Select>

      <div className="hidden sm:block w-[1px] h-4 bg-slate-300/60 mx-1" />

      <Select onValueChange={(value) => onChange({ sort: value })}>
        <SelectTrigger className="w-full sm:w-[135px] h-9 border-none bg-transparent hover:bg-white/60 rounded-xl focus:ring-0 focus:ring-offset-0 transition-all shadow-none px-4 text-slate-600">
          <div className="flex items-center gap-2.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="text-sm font-medium"><SelectValue placeholder="Sort" /></span>
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
          <SelectItem value="due_asc">Oldest First</SelectItem>
          <SelectItem value="due_desc">Newest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
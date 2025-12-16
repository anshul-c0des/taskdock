"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  onChange: (filters: any) => void;
}

export function TaskFilters({ onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      <Select onValueChange={(value) => onChange({ status: value })}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => onChange({ sort: value })}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="due_asc">Due ↑</SelectItem>
          <SelectItem value="due_desc">Due ↓</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormValues } from "@/schema/taskSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserSearch } from "@/hooks/useUser";
import { useCreateTask } from "@/hooks/useTasks";

export default function CreateTaskPage() {
  const { user } = useAuth();
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "MEDIUM", 
      status: "PENDING", 
    },
  });

  const createTaskMutation = useCreateTask();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const { users, loading: usersLoading } = useUserSearch(searchQuery);

  const onSubmit = (data: TaskFormValues) => {
    const payload = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : "",
    };
  
    createTaskMutation.mutate(payload);
  
    form.reset({
      title: "",
      description: "",
      dueDate: "",
      priority: "MEDIUM",
      status: "PENDING",
      assignedToId: undefined,
    });
  
    setSelectedUserId(undefined);
    setSearchQuery("");
  };
  

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Create Task</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Title" {...form.register("title")} />
        <Input placeholder="Description" {...form.register("description")} />
        <Input type="date" {...form.register("dueDate")} />

        <Select
          value={form.watch("priority")}
          onValueChange={(value) => form.setValue("priority", value as "LOW" | "MEDIUM" | "HIGH")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Input
            placeholder="Assign to user (optional)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery.length >= 2 && (
            <ul className="absolute bg-white border mt-1 w-full max-h-48 overflow-y-auto z-10">
              {usersLoading ? (
                <li className="p-2 text-gray-500">Loading...</li>
              ) : users.length === 0 ? (
                <li className="p-2 text-gray-500">No users found</li>
              ) : (
                users.map((u) => (
                  <li
                    key={u.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setSearchQuery(u.name);
                      form.setValue("assignedToId", u.id ?? undefined);
                    }}
                  >
                    {u.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <Button type="submit" disabled={createTaskMutation.isPending}>
          {createTaskMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
}

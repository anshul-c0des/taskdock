"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormValues } from "@/schema/taskSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateTask } from "@/hooks/useTasks";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserSearch } from "@/hooks/useUser";

export default function CreateTaskPage() {
  const { user } = useAuth();
  const form = useForm<TaskFormValues>({ resolver: zodResolver(taskSchema) });
  const createTaskMutation = useCreateTask();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const { users, loading: usersLoading } = useUserSearch(searchQuery);

  const onSubmit = (data: TaskFormValues) => {
    // If assignedToUserId is blank, use current user
    if (!data.assignedToId) {
      data.assignedToId = user?.id;
    }
    createTaskMutation.mutate(data);
    form.reset();
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
                users.map(u => (
                  <li
                    key={u.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setSearchQuery(u.name);
                      form.setValue("assignedToId", u.id);
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

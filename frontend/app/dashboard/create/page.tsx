"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormValues } from "@/schema/taskSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateTask } from "@/hooks/useTasks";

export default function CreateTaskPage() {
  const form = useForm<TaskFormValues>({ resolver: zodResolver(taskSchema) });
  const createTaskMutation = useCreateTask();

  const onSubmit = (data: TaskFormValues) => {
    createTaskMutation.mutate(data);
    form.reset();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Create Task</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Title" {...form.register("title")} />
        <Input placeholder="Description" {...form.register("description")} />
        <Input type="date" {...form.register("dueDate")} />
        <Button type="submit" disabled={createTaskMutation.isPending}>
          {createTaskMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
}

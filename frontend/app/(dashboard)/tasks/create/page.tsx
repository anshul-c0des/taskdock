"use client";

import { TaskFormValues } from "@/schema/taskSchema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCreateTask } from "@/hooks/useTasks";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TaskForm } from "@/components/tasks/TaskForm";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CreateTaskPage() {
  const { user, isInitializing } = useAuth();
  const router = useRouter();
  const createTaskMutation = useCreateTask();

  useEffect(() => {
    if (!user && !isInitializing) {
      router.push("/auth/login");
    }
  }, [user, isInitializing, router]);

  const onSubmit = (data: TaskFormValues) => {
    const payload = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : "",
    };

    createTaskMutation.mutate(payload, {
      onSuccess: () => {
        router.push("/dashboard?tab=created");
        toast.success("Task created successfully!");
      }, 
      onError: (error: any) => {
        const message = error?.response?.data?.message || "Failed to create task.";
        toast.error(message);
      },
    });
  };

  if (isInitializing) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-9 h-9 animate-spin text-indigo-500" />
          <p className="text-slate-500 text-sm font-medium">Just a sec...</p>
        </div>
      );
    }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10">
       <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Back</span>
      </button>
      <Card className="border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="pt-3 px-8">
          <CardTitle className="text-2xl font-bold text-primary tracking-tight">
            Create New Task
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Assign tasks to team members and set clear deadlines.
          </p>
        </CardHeader>
        
        <CardContent className="px-8 pb-8 pt-4">
          <TaskForm 
            onSubmit={onSubmit} 
            submitLabel="Create Task" 
            isSubmitting={createTaskMutation.isPending}
            currentUserId={user?.id}
            taskMeta={{ createdById: user?.id || "" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
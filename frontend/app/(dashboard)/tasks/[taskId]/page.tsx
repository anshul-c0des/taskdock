"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeleteTask, useTask, useUpdateTask } from "@/hooks/useTasks";
import { getSocket } from "@/lib/socket";
import { Task, TaskUpdateInput } from "@/lib/taskApi";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TaskFormValues } from "@/schema/taskSchema";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = Array.isArray(params.taskId) ? params.taskId[0] : params.taskId;

  const { user } = useAuth();
  const router = useRouter();
  
  const { data: task, isLoading, isError, refetch } = useTask(taskId!);
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  useEffect(() => {
    const socket = getSocket();
    socket.on("task:updated", (updatedTask: Task) => {
      if (updatedTask.id === taskId) refetch();
    });

    return () => {
      socket.off("task:updated");
    }; 
  }, [taskId, refetch]);

  const handleUpdate = (data: TaskFormValues) => {
    const updateData: TaskUpdateInput = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
      assignedToId: data.assignedToId,
    };

    console.log("Sending update payload:", updateData);
  
    updateTaskMutation.mutate(
      { taskId: task!.id, data: updateData },
      {
        onSuccess: () => {
          router.push("/dashboard");
          toast.success("Task updated successfully!");
        },
        onError: () => toast.error("Failed to update task")
      }
    );
  };
  
  const handleDelete = () => {
    if (!taskId) return;
    router.push("/dashboard");
    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        toast.success("Task deleted");
      },
      onError: () => toast.error("Failed to delete task")
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-9 h-9 animate-spin text-indigo-500" />
        <p className="text-slate-500 text-sm font-medium">Fetching task details...</p>
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Task not found</h3>
        <p className="text-slate-500 mb-6">This task may have been deleted or moved.</p>
        <Button onClick={() => router.push("/dashboard")} variant="outline">
          Back to Dashboard
        </Button>
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
            Task Details
          </CardTitle>
          <p className="text-sm text-slate-500">
            {task.createdById === user?.id && (
              "View or modify parameters for this task."
            )}
            {task.assignedToId === user?.id && (
              <p>View or modify <span className="text-slate-700 font-semibold">priority and status</span> for this task.</p>
            )}
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-4">
          <TaskForm
            initialValues={{
              title: task?.title || "",
              description: task?.description || "",
              dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
              priority: task?.priority || "MEDIUM",
              status: task?.status || "PENDING",
              assignedToId: task?.assignedToId || undefined,
              assignedUser: task?.assignedTo?.name || "",
            }}
            taskMeta={{
              createdById: task.createdById,
              assignedToId: task.assignedToId ?? undefined,
            }}
            currentUserId={user?.id}
            onSubmit={handleUpdate}
            onDelete={handleDelete}
            submitLabel="Save Changes"
            deleteLabel="Delete Task"
            isSubmitting={updateTaskMutation.isPending}
            isDeleting={deleteTaskMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTask, useUpdateTask } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { getSocket } from "@/lib/socket";

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = Array.isArray(params.taskId)
    ? params.taskId[0]
    : params.taskId;

  if (!taskId) {
    return <p className="text-destructive">Invalid task ID.</p>;
  }

  const { data: task, isLoading, isError, refetch } = useTask(taskId!);
  const updateTaskMutation = useUpdateTask();

  useEffect(() => {
    const socket = getSocket();
    socket.on("task:updated", (updatedTask: any) => {
      if (updatedTask.id === taskId) refetch();
    });

    return () => {
      socket.off("task:updated");
    };
  }, [taskId, refetch]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-destructive">Failed to load task.</p>;

  const markComplete = () => {
    updateTaskMutation.mutate({ taskId: task!.id, data: { status: "DONE" } });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{task?.title}</h1>
      <p className="text-sm text-muted-foreground">{task?.description}</p>

      <div className="text-sm space-y-1">
        <p>Status: {task?.status}</p>
        <p>Assigned to: {task?.assignedTo?.name || "Unassigned"}</p>
      </div>

      <div className="flex gap-2">
        <Button onClick={markComplete}>Mark as Done</Button>
        <Button
          variant="destructive"
          onClick={() =>
            updateTaskMutation.mutate({ taskId: task!.id, data: { status: "OPEN" } })
          }
        >
          Reset Status
        </Button>
      </div>
    </div>
  );
}

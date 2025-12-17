"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTask, useUpdateTask } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { getSocket } from "@/lib/socket";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, TaskUpdateInput, User } from "@/lib/taskApi";
import { useUserSearch } from "@/hooks/useUser";

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = Array.isArray(params.taskId) ? params.taskId[0] : params.taskId;

  const { data: task, isLoading, isError, refetch } = useTask(taskId!);
  const updateTaskMutation = useUpdateTask();

  const [taskInput, setTaskInput] = useState<TaskUpdateInput>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { users, loading: usersLoading } = useUserSearch(searchQuery);

  useEffect(() => {
    if (task) {
      setTaskInput({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        assignedToId: task.assignedToId || undefined,
      });
      if (task.assignedTo) setSelectedUser(task.assignedTo);
    }
  }, [task]);

  useEffect(() => {
    const socket = getSocket();
    socket.on("task:updated", (updatedTask: Task) => {
      if (updatedTask.id === taskId) refetch();
    });

    return () => {
      socket.off("task:updated");
    };
  }, [taskId, refetch]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-destructive">Failed to load task.</p>;

  const handleChange = <K extends keyof TaskUpdateInput>(key: K, value: TaskUpdateInput[K]) => {
    setTaskInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = () => {
    updateTaskMutation.mutate({
      taskId: task!.id,
      data: taskInput,
    });
  };

  return (
    <div className="space-y-6 max-w-xl">

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={taskInput.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={taskInput.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={taskInput.status || "PENDING"}
          onValueChange={(val) => handleChange("status", val as TaskUpdateInput["status"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={taskInput.priority || "MEDIUM"}
          onValueChange={(val) => handleChange("priority", val as TaskUpdateInput["priority"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          type="date"
          id="dueDate"
          value={taskInput.dueDate || ""}
          onChange={(e) => handleChange("dueDate", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Input
          placeholder="Search user..."
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
                    setSelectedUser(u);
                    setSearchQuery(u.name);
                    handleChange("assignedToId", u.id);
                  }}
                >
                  {u.name}
                </li>
              ))
            )}
          </ul>
        )}
        {selectedUser && (
          <p className="text-sm mt-1">Assigned: {selectedUser.name}</p>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Button onClick={handleUpdate} disabled={updateTaskMutation.isPending}>
          {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

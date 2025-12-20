import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTasks,
  fetchTask,
  createTask,
  updateTask,
  deleteTask,
  Task,
  TaskCreateInput,
  TaskUpdateInput,
} from "@/lib/taskApi";
import toast from "react-hot-toast";

export function useTasks() {   // fetches all tasks
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
}

export function useTask(taskId: string) {   // fetches specefic task
  return useQuery<Task>({
    queryKey: ["tasks", taskId],
    queryFn: () => fetchTask(taskId),
  });
}

export function useCreateTask() {   // create a new task
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskCreateInput) => createTask(data),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old) => [
        { id: "temp-" + Date.now(), ...newTask } as Task,
        ...(old || []),
      ]);

      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous)
        queryClient.setQueryData(["tasks"], context.previous);
      toast.error("Failed to create task");
    },
    onSuccess: (createdTask) => {
      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old?.map((t) => (t.id.startsWith("temp-") ? createdTask : t))
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTask() {   // update a task
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: TaskUpdateInput }) =>
      updateTask(taskId, data),
    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previous = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old?.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...Object.fromEntries(
                  Object.entries(data).filter(([_, v]) => v !== undefined)
                ),
              }
            : task
        )
      );

      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous)
        queryClient.setQueryData(["tasks"], context.previous);
      toast.error("Update failed");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useDeleteTask() {   // delte task
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old?.filter((t) => t.id !== taskId)
      );

      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous)
        queryClient.setQueryData(["tasks"], context.previous);
      toast.error("Delete failed");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

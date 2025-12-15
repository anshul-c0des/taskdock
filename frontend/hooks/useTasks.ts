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

export function useTasks() {
    return useQuery<Task[]>({
      queryKey: ["tasks"],
      queryFn: fetchTasks,
    });
  }
  
  export function useTask(taskId: string) {
    return useQuery<Task>({
      queryKey: ["tasks", taskId],
      queryFn: () => fetchTask(taskId),
    });
  }
  
  export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: TaskCreateInput) => createTask(data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });
  }
  
  export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ taskId, data }: { taskId: string; data: TaskUpdateInput }) =>
        updateTask(taskId, data),
      onMutate: async ({ taskId, data }) => {
        await queryClient.cancelQueries({ queryKey: ["tasks"] });
  
        const previous = queryClient.getQueryData<Task[]>(["tasks"]);
  
        queryClient.setQueryData<Task[]>(["tasks"], (old) =>
          old?.map((task) => (task.id === taskId ? { ...task, ...data } : task))
        );
  
        return { previous };
      },
      onError: (_err, _variables, context: any) => {
        if (context?.previous) {
          queryClient.setQueryData(["tasks"], context.previous);
        }
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });
  }
  
  export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (taskId: string) => deleteTask(taskId),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });
  }
  

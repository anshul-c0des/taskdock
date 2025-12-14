import { Button } from "@/components/ui/button";

export default function TaskDetailsPage() {
  // TEMP mock
  const task = {
    title: "Sample Task",
    description: "Description here",
    status: "OPEN",
    assignedTo: "Jane Doe",
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{task.title}</h1>

      <p className="text-sm text-muted-foreground">
        {task.description}
      </p>

      <div className="text-sm space-y-1">
        <p>Status: {task.status}</p>
        <p>Assigned to: {task.assignedTo}</p>
      </div>

      <div className="flex gap-2">
        <Button>Edit</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    </div>
  );
}

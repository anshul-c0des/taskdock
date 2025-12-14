import Link from "next/link";

export default function DashboardPage() {
  // TEMP mock data (Phase 6 replaces)
  const tasks: any[] = [];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">My Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tasks yet. Create your first task.
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <Link key={task.id} href={`/tasks/${task.id}`}>
              <li className="border rounded-lg p-4 hover:bg-accent">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground">
                  Due {task.dueDate}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}

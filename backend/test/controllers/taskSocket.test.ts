import { assignTaskController } from "../../src/controllers/taskController";
import * as socketModule from "../../src/lib/socket";
import * as taskService from "../../src/services/taskService";

describe("Socket notification on assignment", () => {   // tests task:assigned socket event
  it("emits task:assigned event", async () => {
    const emit = jest.fn();
    const to = jest.fn().mockReturnValue({ emit });
    const next = jest.fn();

    (socketModule.io as any) = { to };   // mock data

    const req: any = {
      params: { taskId: "task123" },
      body: { assignedToId: "user123" },
      app: { get: () => ({ to }) },
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.spyOn(taskService, "assignTask").mockResolvedValue({
      id: "task123",   // task Id
      title: "Test Task",
      description: "A test task",
      status: "PENDING",
      priority: "MEDIUM",
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: "creator123",   // creator
      createdBy: {
        id: "creator123",
        name: "Creator User",
        email: "creator@test.com",
      },
      assignedTo: {
        id: "user123",
        name: "Test User",
        email: "user123@test.com",
      },
      assignedToId: "user123",  // assignee
    });

    await assignTaskController(req, res, next);

    expect(to).toHaveBeenCalledWith("user123");
    expect(emit).toHaveBeenCalledWith("task:assigned", expect.any(Object));
  }, 10000);
});

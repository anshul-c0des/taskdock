import { createUser } from "../factories/userFactory";
import { prisma } from "../../src/lib/prisma";
import * as taskService from "../../src/services/taskService";
import { cleanupTestData } from "../setup";

describe("Task Service", () => {
  let user: any;

  beforeAll(async () => {
    user = await createUser();   // create a test user
  });

  afterAll(async () => {
    await cleanupTestData();   // clean up test data
  });

  it("creates a task with valid data", async () => {
    const task = await taskService.createTask({   // create a new task in db
      title: "New Task",
      dueDate: new Date(),
      createdById: user.id,
    });

    expect(task).toHaveProperty("id");
    expect(task.title).toBe("New Task");

    const dbTask = await prisma.task.findUnique({
      where: { id: task.id },
    });

    expect(dbTask).not.toBeNull();
  });
});

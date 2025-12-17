import { createUser } from "../factories/userFactory";
import { prisma } from "../../src/lib/prisma";
import * as taskService from "../../src/services/taskService";
import { cleanupTestData } from "../setup";

describe("Task Service", () => {
  let user: any;

  beforeAll(async () => {
    // create a unique test user
    user = await createUser();
  });

  afterAll(async () => {
    // safely remove only test data
    await cleanupTestData();
  });

  it("creates a task with valid data", async () => {
    const task = await taskService.createTask({
      title: "New Task",
      dueDate: new Date(),
      createdById: user.id, // use test user
    });

    expect(task).toHaveProperty("id");
    expect(task.title).toBe("New Task");

    const dbTask = await prisma.task.findUnique({
      where: { id: task.id },
    });

    expect(dbTask).not.toBeNull();
  });
});

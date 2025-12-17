import { createUser } from "../factories/userFactory";
import { createTask } from "../factories/taskFactory";
import * as taskService from "../../src/services/taskService";
import { cleanupTestData } from "../setup";

describe("Task Assignment", () => {
  let creator: any;
  let assignee: any;

  beforeAll(async () => {
    // safely create unique test users
    creator = await createUser();
    assignee = await createUser();
  });

  afterAll(async () => {
    // clean up only test data
    await cleanupTestData();
  });

  it("assigns a task to a user", async () => {
    const task = await createTask({ createdById: creator.id });

    const updated = await taskService.assignTask(task.id, assignee.id);

    expect(updated.assignedToId).toBe(assignee.id);
  }, 10000);
});

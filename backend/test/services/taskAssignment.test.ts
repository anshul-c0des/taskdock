import { createUser } from "../factories/userFactory";
import { createTask } from "../factories/taskFactory";
import * as taskService from "../../src/services/taskService";
import { cleanupTestData } from "../setup";

describe("Task Assignment", () => {
  let creator: any;
  let assignee: any;

  beforeAll(async () => {   // creates two users
    creator = await createUser();
    assignee = await createUser();
  });

  afterAll(async () => {
    await cleanupTestData();   // clean up test data
  });

  it("assigns a task to a user", async () => {
    const task = await createTask({ createdById: creator.id });   // create a new task

    const updated = await taskService.assignTask(task.id, assignee.id);   // assign task to other user

    expect(updated.assignedToId).toBe(assignee.id);
  }, 10000);
});

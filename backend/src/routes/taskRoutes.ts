import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { validate } from "../utils/validate";
import { createTaskSchema, updateTaskSchema } from "../schemas/taskSchema";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTaskController,
} from "../controllers/taskController";

const router = Router();

router.use(requireAuth);   // protected route, jwt token verification

router.post("/", validate(createTaskSchema), createTask);   // create a new task with validated task schema
router.get("/", getTasks);   // get all tasks associated with current user
router.get("/:id", getTaskById);   // get a specific task by id
router.patch("/:id", validate(updateTaskSchema), updateTask);   // updates a task
router.delete("/:id", deleteTask);   // delete a task
router.put("/:taskId/assign", assignTaskController);   // assign a task to other user (used by taskService for tests)

export default router;

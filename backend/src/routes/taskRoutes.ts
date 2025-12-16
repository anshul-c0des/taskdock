import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController';

const router = Router();

router.use(requireAuth);

router.post('/', createTask);
router.get('/', requireAuth, getTasks);
router.get('/:id', requireAuth, getTaskById);
router.patch('/:id', requireAuth, updateTask);
router.delete('/:id', requireAuth, deleteTask);

export default router;

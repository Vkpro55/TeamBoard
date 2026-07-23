import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import {
  createTask,
  deleteTask,
  getProjectTasks,
  markTaskComplete,
  updateTask,
} from '../controllers/taskController';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get('/', getProjectTasks);
router.post('/', createTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);
router.patch('/:taskId/complete', markTaskComplete);

export default router;

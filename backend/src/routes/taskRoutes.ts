import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import {
  createTask,
  deleteTask,
  getProjectTasks,
  markTaskComplete,
  updateTask,
} from '../controllers/taskController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get('/', asyncHandler(getProjectTasks));
router.post('/', asyncHandler(createTask));
router.put('/:taskId', asyncHandler(updateTask));
router.delete('/:taskId', asyncHandler(deleteTask));
router.patch('/:taskId/complete', asyncHandler(markTaskComplete));

export default router;

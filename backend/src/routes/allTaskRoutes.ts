import { Router } from 'express';
import { listTasks } from '../controllers/taskController';
import { requireAuth } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(listTasks));

export default router;

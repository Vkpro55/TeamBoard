import { Router } from 'express';
import { listTasks } from '../controllers/taskController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', listTasks);

export default router;
import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import {
  archiveProject,
  createProject,
  deleteProject,
  updateProject,
} from '../controllers/projectController';
import taskRoutes from './taskRoutes';

const router = Router();

router.use(requireAuth);

router.post('/', createProject);
router.put('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);
router.patch('/:projectId/archive', archiveProject);
router.use('/:projectId/tasks', taskRoutes);

export default router;

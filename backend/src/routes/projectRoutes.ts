import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import {
  archiveProject,
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from '../controllers/projectController';
import { asyncHandler } from '../utils/asyncHandler';
import taskRoutes from './taskRoutes';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(listProjects));
router.post('/', asyncHandler(createProject));
router.put('/:projectId', asyncHandler(updateProject));
router.delete('/:projectId', asyncHandler(deleteProject));
router.patch('/:projectId/archive', asyncHandler(archiveProject));
router.use('/:projectId/tasks', taskRoutes);

export default router;

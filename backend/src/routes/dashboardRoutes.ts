import { Router } from 'express';
import { getDashboard } from '../controllers/dashboardController';
import { requireAuth } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(getDashboard));

export default router;

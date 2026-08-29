import { Router } from 'express';
import {
  signup,
  login,
  logout,
  refreshAuth,
  me,
} from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/refresh', asyncHandler(refreshAuth));
router.get('/me', requireAuth, asyncHandler(me));

export default router;

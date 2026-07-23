import { Router } from 'express';
import {
  signup,
  login,
  logout,
  refreshAuth,
  me,
} from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/refresh', refreshAuth);
router.get('/me', requireAuth, me);

export default router;

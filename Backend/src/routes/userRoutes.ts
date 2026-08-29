import { Router } from 'express';
import { updatePassword, updateProfile } from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';
import { uploadProfilePic } from '../middleware/profileUpload';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth);

router.patch('/profile', uploadProfilePic.single('profilePic'), asyncHandler(updateProfile));
router.patch('/password', asyncHandler(updatePassword));

export default router;

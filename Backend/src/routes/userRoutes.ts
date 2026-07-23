import { Router } from 'express';
import { updatePassword, updateProfile } from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';
import { uploadProfilePic } from '../middleware/profileUpload';

const router = Router();

router.use(requireAuth);

router.patch('/profile', uploadProfilePic.single('profilePic'), updateProfile);
router.patch('/password', updatePassword);

export default router;
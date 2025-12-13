import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.get('/me', requireAuth, getProfile);
router.put('/me', requireAuth, updateProfile);

export default router;

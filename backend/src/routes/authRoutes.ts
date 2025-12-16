import express from 'express';
import { login, register, getMe, updateDetails } from '../controllers/authController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/updatedetails', auth, updateDetails); // ✅ New Route

export default router;
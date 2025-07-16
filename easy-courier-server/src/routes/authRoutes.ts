import express from 'express';
import { register, login, getUserData, getLoggedInUser } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/allUsers', getUserData);
router.get('/me', protect, getLoggedInUser);


export default router;
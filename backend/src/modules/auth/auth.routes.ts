import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { currentUser, listUsers, login, logout, register } from './auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', currentUser);
router.post('/logout', logout);
router.get('/profile', authMiddleware, listUsers);

export default router;

import { Router } from 'express';
import { getHistory, addMovieToHistory } from './history.controller';
import { authMiddleware } from '../../authMiddleware';

const router = Router();

router.get('/history', authMiddleware, getHistory);
router.post('/history', authMiddleware, addMovieToHistory);

export default router;

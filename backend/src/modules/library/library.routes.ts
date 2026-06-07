import { Router } from 'express';
import { getLibrary, toggleFavorite } from './library.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/library', authMiddleware, getLibrary);
router.post('/library/toggle', authMiddleware, toggleFavorite);

export default router;

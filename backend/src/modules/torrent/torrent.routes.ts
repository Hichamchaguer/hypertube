import { Router } from 'express';
import {
	getPlaylist,
	getSegment,
	listQualities,
	startStream,
} from './torrent.controller';
import { authMiddleware } from '../../authMiddleware';

const router = Router();

router.get('/stream/:movieId/:quality', authMiddleware, startStream);
router.get('/getStreamPlaylist/:movieId/:quality', getPlaylist);
router.get('/getSegment/:movieId/:quality/:segment', getSegment);
router.get('/availableQualities/:movieId', authMiddleware, listQualities);

export default router;

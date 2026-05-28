import { Router } from 'express';
import {
	getPlaylist,
	getSegment,
	listQualities,
	startStream,
} from './torrent.controller';

const router = Router();

router.get('/stream/:movieId/:quality', startStream);
router.get('/getStreamPlaylist/:movieId/:quality', getPlaylist);
router.get('/getSegment/:movieId/:quality/:segment', getSegment);
router.get('/availableQualities/:movieId', listQualities);

export default router;

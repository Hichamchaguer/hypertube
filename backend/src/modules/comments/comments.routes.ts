import { Router } from 'express';
import { listComments } from './comments.controller';

const router = Router();

router.get('/', listComments);

export default router;

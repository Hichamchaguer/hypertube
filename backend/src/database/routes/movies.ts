import routes from 'express';
import { getMovies } from '../../services/archive.controller';

const router = routes.Router();

router.get('/movies', getMovies);

export default router;
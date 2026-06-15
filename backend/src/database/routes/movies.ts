import routes from 'express';
import { getMovies, getMoviesById, searchMovies } from '../../services/archive.controller';

const router = routes.Router();

router.get('/movies', getMovies);
router.get('/movies/:id', getMoviesById);
router.get('/search', searchMovies);

export default router;
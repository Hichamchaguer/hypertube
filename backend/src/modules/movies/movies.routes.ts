import { Router } from 'express';
import { getMovieById, getMovies, searchMoviesHandler } from './movies.controller';

const router = Router();

router.get('/movies', getMovies);
router.get('/movies/:id', getMovieById);
router.get('/search', searchMoviesHandler);

export default router;

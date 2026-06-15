import { Request, Response } from 'express';
import { fetchMovieById, fetchPopularMovies, searchMovies } from './movies.service';

export const getMovies = async (_req: Request, res: Response) => {
  try {
    const movies = await fetchPopularMovies();
    return res.json(movies);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get movies' });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const movieId = String(req.params.id || '').trim();
    if (!movieId) {
      return res.status(400).json({ error: 'Movie id is required' });
    }
    const movie = await fetchMovieById(movieId);
    return res.json(movie);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get movie details' });
  }
};

export const searchMoviesHandler = async (req: Request, res: Response) => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    const results = await searchMovies(query);
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ error: 'Search failed' });
  }
};

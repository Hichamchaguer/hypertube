import { Request, Response } from 'express';
import * as libraryService from './library.service';

export const getLibrary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in session' });
    }

    const library = await libraryService.getUserLibrary(userId);
    return res.json(library);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch library' });
  }
};

export const toggleFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { movieId } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ error: 'User ID and Movie ID are required' });
    }

    const result = await libraryService.toggleFavorite(userId, movieId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};

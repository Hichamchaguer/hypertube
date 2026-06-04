import { Request, Response } from 'express';
import * as historyService from './history.service';

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in session' });
    }

    const history = await historyService.getUserHistory(userId);
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch watch history' });
  }
};

export const addMovieToHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { movieId } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ error: 'User ID and Movie ID are required' });
    }

    await historyService.addToHistory(userId, movieId);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add movie to history' });
  }
};

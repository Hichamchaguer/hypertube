import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import {
  createStream,
  getAvailableQualities,
  getSegmentPath,
  getStreamPlaylist,
  streamFile,
} from './torrent.service';
import { addToHistory } from '../history/history.service';

export const startStream = async (req: Request, res: Response) => {
  try {
    const movieId = String(req.params.movieId || '').trim();
    const quality = String(req.params.quality || '').trim();
    if (!movieId || !quality) {
      return res.status(400).json({ error: 'Movie id and quality are required' });
    }

    // Record in history if user is authenticated
    const userId = (req as any).user?.id;
    if (userId) {
      addToHistory(userId, movieId).catch(err => 
        console.error('Failed to record history asynchronously:', err)
      );
    }

    const response = await createStream(movieId, quality);
    return res.json(response);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Failed to start stream',
      message: err?.message || 'Unknown error',
    });
  }
};

export const getPlaylist = async (req: Request, res: Response) => {
  try {
    const movieId = String(req.params.movieId || '').trim();
    const quality = String(req.params.quality || '').trim();
    if (!movieId || !quality) {
      return res.status(400).json({ error: 'Movie id and quality are required' });
    }
    const playlistPath = await getStreamPlaylist(movieId, quality);
    const content = await fs.readFile(playlistPath, 'utf-8');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const segmentBase = `${baseUrl}/api/torrent/getSegment/${movieId}/${quality}`;
    const rewritten = content
      .split('\n')
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          return line;
        }
        return `${segmentBase}/${trimmed}`;
      })
      .join('\n');

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    return res.send(rewritten);
  } catch (err: any) {
    return res.status(404).json({
      error: 'Playlist not found',
      message: err?.message || 'Unknown error',
    });
  }
};

export const getSegment = async (req: Request, res: Response) => {
  try {
    const movieId = String(req.params.movieId || '').trim();
    const quality = String(req.params.quality || '').trim();
    const segment = String(req.params.segment || '').trim();

    if (!movieId || !quality || !segment) {
      return res.status(400).json({
        error: 'Movie id, quality, and segment are required',
      });
    }

    res.setHeader('Content-Type', 'video/MP2T');
    res.setHeader('Accept-Ranges', 'bytes');

    const segmentPath = await getSegmentPath(movieId, quality, segment);
    return streamFile(segmentPath, res);
  } catch (err: any) {
    return res.status(404).json({
      error: 'Segment not found',
      message: err?.message || 'Unknown error',
    });
  }
};

export const listQualities = async (req: Request, res: Response) => {
  try {
    const movieId = String(req.params.movieId || '').trim();
    if (!movieId) {
      return res.status(400).json({ error: 'Movie id is required' });
    }
    const qualities = await getAvailableQualities(movieId);
    return res.json(qualities);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Failed to load qualities',
      message: err?.message || 'Unknown error',
    });
  }
};

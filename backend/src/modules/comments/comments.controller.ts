import { Request, Response } from 'express';

export const listComments = async (_req: Request, res: Response) => {
  return res.status(501).json({ message: 'Comments module not implemented yet.' });
};

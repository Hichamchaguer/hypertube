import { Request, Response } from 'express';

export const getUsers = async (_req: Request, res: Response) => {
  return res.status(501).json({ message: 'Users module not implemented yet.' });
};

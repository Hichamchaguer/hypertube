import { Request, Response } from 'express';
import { getAllUsers, getUserFromToken, loginUser, registerUser } from './auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    return res.send(user);
  } catch (err: any) {
    if (err?.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }
    return res.status(500).json({ message: 'Internal server error while creating user.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { token } = await loginUser(req.body);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.send({ message: 'Login successful' });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.cookie('jwt', '', { maxAge: 0 });
  return res.send({ message: 'Logout successful' });
};

export const currentUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.jwt as string | undefined;
    const user = await getUserFromToken(token);
    if (!user) {
      return res.send({ user: 'Unauthenticated' });
    }
    return res.send(user);
  } catch (err) {
    return res.status(404).json({ error: 'Error fetching user' });
  }
};

export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.send({ message: users });
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching users' });
  }
};

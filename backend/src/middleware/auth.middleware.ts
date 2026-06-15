import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      message: 'Not authenticated',
    });
  }

  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
};

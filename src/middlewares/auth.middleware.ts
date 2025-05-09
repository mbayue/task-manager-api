import jwt from 'jsonwebtoken';
import redisClient from '../services/cache.service';
import { Request, Response, NextFunction } from 'express';

export const protect = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  const tokenExists = await redisClient.get(`auth:token:${token}`);

  if (!tokenExists) {
    res.status(401).json({ message: 'Token expired or invalidated' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized' });
  }
};

export const adminOnly = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role == 'admin') next();
  else res.status(401).json({ message: 'User not authorized' });
};

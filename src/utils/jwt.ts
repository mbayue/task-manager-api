import jwt from 'jsonwebtoken';
import redisClient from '../services/cache.service';

export const generateToken = (id: string, role: string): string => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
  redisClient.set(`auth:token:${token}`, '1', { EX: 3600 });
  return token;
};

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded && typeof decoded === 'object' && 'id' in decoded) {
      return (decoded as { id: string }).id;
    }
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getRoleFromToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded && typeof decoded === 'object' && 'role' in decoded) {
      return (decoded as { role: string }).role;
    }
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

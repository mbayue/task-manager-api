import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import redisClient from '../services/cache.service';

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ message: 'User already exists' });
    return;
  }

  const id = new mongoose.Types.ObjectId();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    _id: id,
    name,
    email,
    password: hashedPassword,
  });

  res
    .status(201)
    .json({ token: generateToken(user._id!.toString(), user.role) });
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (
    !user ||
    !user.password ||
    !(await bcrypt.compare(password, user.password))
  ) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  res.json({ token: generateToken(user._id!.toString(), user.role) });
};

export const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  const token = authHeader!.split(' ')[1];
  await redisClient.del(`auth:token:${token}`);

  res.json({ message: 'Logged out successfully' });
};

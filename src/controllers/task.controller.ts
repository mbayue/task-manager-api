import { Request, Response } from 'express';
import Task from '../models/task.model';
import User from '../models/user.model';
import redisClient from '../services/cache.service';
import { getUserIdFromToken } from '../utils/jwt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

export const createTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const id = new mongoose.Types.ObjectId();
  req.body._id = id;
  if (!req.body.assignedTo) {
    const token = req.headers.authorization?.split(' ')[1];
    req.body.assignedTo = getUserIdFromToken(token!);
  }
  if (req.body.assignedTo) {
    const user = await User.findById(req.body.assignedTo);
    if (!user) {
      res.status(400).json({
        errors: [
          {
            type: 'field',
            value: req.body.assignedTo,
            msg: 'User not found',
            path: 'assignedTo',
            location: 'body',
          },
        ],
      });
      return;
    }
  }
  const task = await Task.create(req.body);
  await redisClient.del('tasks');
  res.status(201).json(task);
};

export const getTasks = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { status, dueDate, user } = req.query;

  const filter: any = {};

  if (status) {
    filter.status = status;
  }

  if (dueDate) {
    const date = new Date(dueDate as string);
    if (!isNaN(date.getTime())) {
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.dueDate = {
        $gte: start,
        $lte: end,
      };
    }
  }

  if (user) {
    if (mongoose.Types.ObjectId.isValid(user as string)) {
      filter.assignedTo = new mongoose.Types.ObjectId(user as string);
    }
  }

  const cached = await redisClient.get(`tasks:${JSON.stringify(filter)}`);
  if (cached) {

    res.json(JSON.parse(cached));
    return;
  }

  const tasks = await Task.find(filter);
  await redisClient.set(
    `tasks:${JSON.stringify(filter)}`,
    JSON.stringify(tasks),
    { EX: 60 },
  );
  res.json(tasks);
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({
      errors: [
        {
          type: 'field',
          value: req.params.id,
          msg: 'Task not found',
          path: 'id',
          location: 'params',
        },
      ],
    });
    return;
  }

  res.json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!task) {
    res.status(404).json({
      errors: [
        {
          type: 'field',
          value: req.params.id,
          msg: 'Task not found',
          path: 'id',
          location: 'params',
        },
      ],
    });
    return;
  }

  await redisClient.del('tasks');
  res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    res.status(404).json({
      errors: [
        {
          type: 'field',
          value: req.params.id,
          msg: 'Task not found',
          path: 'id',
          location: 'params',
        },
      ],
    });
    return;
  }

  await redisClient.del('tasks');
  res.json(task);
};

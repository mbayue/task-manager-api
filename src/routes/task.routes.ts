import express from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from '../controllers/task.controller';
import { adminOnly, protect } from '../middlewares/auth.middleware';
import {
  validateCreateTask,
  validateGetTasks,
  validateId,
  validateUpdateTask,
} from '../utils/validator';

const router = express.Router();
router
  .route('')
  .get(protect, validateGetTasks, getTasks)
  .post(protect, validateCreateTask, createTask);
router
  .route('/:id')
  .get(protect, validateId, getTask)
  .put(protect, validateId, validateUpdateTask, updateTask);
router.delete('/:id', protect, adminOnly, validateId, deleteTask);
export default router;

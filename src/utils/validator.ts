import { body, query, param } from 'express-validator';

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const validateCreateTask = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('status')
    .notEmpty()
    .isIn(['pending', 'in-progress', 'done'])
    .withMessage('Status must be one of: pending, in-progress, done'),
  body('dueDate')
    .isDate()
    .withMessage('Due date is required')
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      const due = new Date(value);
      if (due < new Date()) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Assigned to must be a valid ObjectId'),
];

export const validateUpdateTask = [
  body('title').optional().isString().withMessage('Title must be a string'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'done'])
    .withMessage('Status must be one of: pending, in-progress, done'),
  body('dueDate')
    .optional()
    .isDate()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      const due = new Date(value);
      if (due < new Date()) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Assigned to must be a valid ObjectId'),
];

export const validateGetTasks = [
  query('user')
    .optional()
    .isMongoId()
    .withMessage('User must be a valid ObjectId'),
  query('dueDate')
    .optional()
    .isDate()
    .withMessage('Due date must be a valid date'),
  query('status')
    .optional()
    .isIn(['pending', 'in-progress', 'done'])
    .withMessage('Status must be one of: pending, in-progress, done'),
];

export const validateId = [
  param('id').isMongoId().withMessage('Id must be a valid ObjectId'),
];

import express from 'express';

import { login, logout, register } from '../controllers/auth.controller';
import { validateLogin, validateRegister } from '../utils/validator';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', protect, logout);
export default router;

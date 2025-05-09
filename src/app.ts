import express from 'express';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middlewares/error.middleware';
import morgan from 'morgan';
import responseTime from 'response-time';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTime());
app.use(morgan('combined'));

app.get('/', (_req, res) => {
  res.send('Ok!');
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);
export default app;

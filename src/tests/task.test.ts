import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import Task from '../models/task.model';

let token: string;
let taskId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  await Task.deleteMany({ title: 'Test Task' })
    .then((result) => {
      console.log(`${result.deletedCount} tasks deleted.`);
    })
    .catch((err) => {
      console.error('Error deleting tasks:', err);
    });

  const res = await request(app).post('/api/auth/login').send({
    email: 'Virgie51@yahoo.com',
    password: '6O1sXUekyNc4TTi',
  });

  token = res.body.token;
});

describe('Task API', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        _id: new mongoose.Types.ObjectId(),
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2025/05/29',
        status: 'pending',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test Task');
    taskId = res.body._id;
  });

  it('should fetch tasks with filter', async () => {
    const res = await request(app)
      .get('/api/tasks?status=pending')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should check user role', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

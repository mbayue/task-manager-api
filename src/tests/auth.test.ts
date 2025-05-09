import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
});

describe('Auth API', () => {
  it('should login user and return JWT', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'Virgie51@yahoo.com',
      password: '6O1sXUekyNc4TTi',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

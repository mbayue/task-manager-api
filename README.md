# 📋 Task Manager API

A task management backend built with **Node.js**, **Express**, **MongoDB**, **TypeScript**, and **Redis**, designed to support CRUD operations, authentication, caching, and Dockerized deployment.

---

## 🚀 Features

- User Registration and Login (with JWT)
- Role-based Authorization (`admin`, `user`)
- Task CRUD operations
- Task filtering by status and due date
- Caching with Redis for task listing
- Mongoose validation and relationships
- Containerized with Docker
- Unit Testing with Jest, Supertest

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB with Mongoose
- **Auth:** JWT
- **Caching:** Redis
- **Testing:** Jest, Supertest
- **Deployment:** Docker, Render

---

## 📁 Project Structure

The project is structured as follows:
- **`app.ts`**: Sets up Express app, middleware, and routes.
- **`server.ts`**: Starts the server, connects to MongoDB/Redis.
- **`config/`**: Contains configuration for external services like MongoDB and Redis.
- **`controllers/`**: Functions that process requests and interact with services/models.
- **`middlewares/`**: Contains middleware for authentication, error handling, and input validation.
- **`models/`**: Mongoose schema definitions for collections like `User` and `Task`.
- **`routes/`**: Maps endpoints to controller methods.
- **`services/`**: Handles core logic like token generation, password hashing, etc.
- **`utils/`**: General-purpose utility functions used across the project.
- **`tests/`**: Test files organized by feature or layer.

---

## ⚙️ Setup Instructions

### 1. **Clone Repo**
   ```bash
   git clone https://github.com/bayue48/task-manager.git
   cd task-manager
   ```

### 2. **Install Dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   pnpm install
   ```

### 3. **Environment Variables**
   Create a `.env` file in the root directory and add the following environment variables:
   ```bash
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_jwt_secret
   REDIS_URL=redis://localhost:6379
   ```

### 4. **Run Server**
   ```bash
   npm run dev
   ```

---

## 🧪 Run Test

```bash
npm run test
```

---

## 🚀 Deployment

### 1. **Build Docker Image**
   ```bash
   docker build -t task-manager .
   ```

### 2. **Run Docker Container**
   ```bash
   docker run -p 3000:3000 --env-file .env task-manager-api
   ```

### 3. **Access API**
   ```bash
   http://localhost:3000/api
   ```

---

## 📬 API Endpoints

1. Authentication
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/auth/logout

2. Tasks
   - GET /api/tasks
   - POST /api/tasks
   - GET /api/tasks/:id
   - PUT /api/tasks/:id
   - DELETE /api/tasks/:id

---

## 📄 Postman Collection
Included in /docs folder. Import task-manager.postman_collection.json into Postman.
It also contains aarchitecture diagaram and sample data for live demo.

---

## 🌍 Live Demo

You can access the live demo at [https://task-manager-ayq1.onrender.com/](https://task-manager-ayq1.onrender.com/)

---
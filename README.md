# TaskDock

A full-stack, collaborative task management application with real-time updates, user authentication, task CRUD, and personal dashboards. Built with a mobile-first approach.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Setup Instructions](#setup-instructions)  
  - [Backend](#backend)  
  - [Frontend](#frontend)  
- [API Documentation](#api-documentation)  
- [Architecture Overview & Design Decisions](#architecture-overview--design-decisions)  
- [Socket.io Integration](#socketio-integration)  
- [Trade-offs & Assumptions](#trade-offs--assumptions)  

---

## Features

- User authentication (JWT via HttpOnly cookies + bcypt)  
- User profiles  
- Task creation, reading, updating, and deletion (CRUD)  
- Assign tasks to other users  
- Real-time task updates and assignment notifications via Socket.io  
- Personal dashboards (created tasks, assigned tasks, overdue tasks)  
- Filtering & sorting of tasks  
- Mobile-first responsive design  

---

## Tech Stack

**Frontend:**
- Next.js (Pages Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query (TanStack Query)
- React Hook Form + Zod
- react-hot-toast
- Socket.io Client

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL (Supabase)
- Prisma ORM
- JWT (HttpOnly cookies)
- bcrypt
- Socket.io
- Zod validation
- Jest (for unit testing)

**Deployment:**
- Backend (Cold Start): [Render]('https://taskdock-sqsv.onrender.com')
- Frontend: [Vercel]('https://taskdock-one.vercel.app')
- Database: Supabase (PostgreSQL)

---

## Setup Instructions

### Backend

1. Clone the repo and navigate to the backend folder:

```bash
git clone https://github.com/anshul-c0des/taskdock.git
cd taskdock/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file and set:

```bash
DATABASE_URL=<your_supabase_postgres_url>
FRONTEND_URL=http://localhost:3000
JWT_SECRET=<your_jwt_secret>
NODE_ENV=development
PORT=5000
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev
```

5. Start the backend server:
```bash
npm run dev
```

API will be available at http://localhost:5000/api.

### Frontend

1. Navigate to the frontend folder:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env.local file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

4. Run the frontend:
```bash
npm run dev
```

App will be available at http://localhost:3000.

## API Documentation

- Base URL: /api

- Auth Routes

| Method | Endpoint       | Body                        | Description          |
|--------|----------------|-----------------------------|--------------------|
| POST   | /auth/register | `{ name, email, password }` | Register a new user |
| POST   | /auth/login    | `{ email, password }`       | Logs in user       |
| POST   | /auth/logout   | None                        | Logs out the user    |

- User Routes

| Method | Endpoint      | Body                | Description                 |
|--------|---------------|-------------------|-----------------------------|
| GET    | /users/me     | None               | Get current user's profile  |
| PUT    | /users/me     | `{ name?, email? }` | Update current user's profile |
| GET    | /users        | `?search=string`   | Search users by name        |

- Task Routes

| Method | Endpoint                   | Body                                                | Description                              |
|--------|----------------------------|----------------------------------------------------|------------------------------------------|
| POST   | /tasks                     | `{ title, description?, priority, dueDate?, assignedToId? }` | Create a new task                        |
| GET    | /tasks                     | None                                               | Get tasks for current user               |
| GET    | /tasks/:id                 | None                                               | Get a task by ID                          |
| PATCH  | /tasks/:id                 | `{ title?, description?, status?, priority?, dueDate?, assignedToId? }` | Update a task (creator or assignee)      |
| DELETE | /tasks/:id                 | None                                               | Delete a task (creator only)             |
| PUT    | /tasks/:taskId/assign      | `{ assignedToId }`                                 | Assign a task to a user                  |


## Architecture Overview & Design Decisions

- **Authentication:** **JWT** stored in **HttpOnly cookies** for better security.`requireAuth` middleware protects routes.
- **Task Ownership:** Only **creators** can fully update tasks.**Assignees** can update only **status** and **priority**.
- **Database Choice:** **Supabase (PostgreSQL)** provides a scalable relational database with Prisma integration.
- **Validation:** Request bodies are validated using **Zod**.

## Socket.io Integration
- Integrated into the backend via `lib/socket.ts`.  
- Backend emits events on task creation, updates, deletion, and assignment:
  - `"task:created"`
  - `"task:updated"`
  - `"task:deleted"`
  - `"task:assigned"`
- Frontend listens to these events to provide **real-time updates** to dashboards and notifications.

## Trade-offs & Assumptions
- JWTs are stored in cookies for security, **not localStorage**.  
- Simple task priority system: **LOW, MEDIUM, HIGH**.  
- Only **task creators or assignees** can edit tasks.  
- Socket.io events assume users are **connected and joined rooms** based on user ID.  
- Minimal search results for users (**max 10**) to reduce payload.

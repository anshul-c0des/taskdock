import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/errorMiddleware';
import authRouter from './routes/authRoutes'
import userRouter from './routes/userRoutes'
import taskRouter from './routes/taskRoutes'

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(errorMiddleware);

app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/users', userRouter);

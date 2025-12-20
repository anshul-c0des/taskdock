import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import taskRouter from "./routes/taskRoutes";

export const app = express();

app.use(   // cors setup
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.get("/", (_req, res) => {   // handshake
  res.status(200).json({ message: "TaskDock is live" });
});

app.use(express.json());
app.use(cookieParser());

app.use(errorMiddleware);   // error middleware zod/server

app.use("/api/auth", authRouter);   // auth routes
app.use("/api/tasks", taskRouter);   // task routes
app.use("/api/users", userRouter);   // user routes

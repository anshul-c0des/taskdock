import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt";

const isProduction = process.env.NODE_ENV === "production";   // current environment

export const register = async (   // registers a new user
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });   // check for existing user
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);   // hash pass using bcrypt

    const user = await prisma.user.create({   // create a new user
      data: { name, email, password: hashedPassword },
    });

    const token = signToken({ userId: user.id });   /// sign jwt token

    res
      .cookie("token", token, {   // attach token in http-only cookies
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
      })
      .status(201)
      .json({
        message: "User registered",
        user: { id: user.id, name: user.name, email: user.email },
      });
  } catch (err) {
    next(err);
  }
};

export const login = async (   // log in existing user
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });   // check whether user exists
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);   // compares credentials
    if (!isValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({ userId: user.id });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
      })
      .status(200)
      .json({
        message: "Logged in",
        user: { id: user.id, name: user.name, email: user.email },
      });
  } catch (err) {
    next(err);
  }
};

export const logout = async (_req: Request, res: Response) => {   // log out current user
  res.clearCookie("token").status(200).json({ message: "Logged out" });
};

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { signToken } from '../utils/jwt';

const isProduction = process.env.NODE_ENV === 'production';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = signToken({ userId: user.id });

    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      })
      .status(201)
      .json({ message: 'User registered', user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken({ userId: user.id });

    res
      .cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' })
      .status(200)
      .json({ message: 'Logged in', user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('token').status(200).json({ message: 'Logged out' });
};

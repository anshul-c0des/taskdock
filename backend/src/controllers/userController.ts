import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name, email },
    });

    res.status(200).json({ user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email } });
  } catch (err) {
    next(err);
  }
};

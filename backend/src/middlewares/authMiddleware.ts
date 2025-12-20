import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../lib/prisma";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;   // checks cookies for token
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = verifyToken(token);   // verify token then grant or revoke access
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    (req as any).user = user;
    next();
  } catch (err) {
    next(err);
  }
};

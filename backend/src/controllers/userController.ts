import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const getProfile = async (   // get current logged in user details
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    res
      .status(200)
      .json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const searchUsers = async (   // searches available users to assign tasks
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.query;

    if (!search || typeof search !== "string" || search.trim().length < 2) {
      return res
        .status(400)
        .json({
          users: [],
          message: "Search query must be at least 2 characters",
        });
    }

    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: 10, // limit to 10 results
    });

    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

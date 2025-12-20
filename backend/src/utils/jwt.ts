import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export const signToken = (payload: { userId: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });   // valid for 1 day
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};

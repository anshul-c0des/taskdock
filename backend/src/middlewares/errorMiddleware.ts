import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors,
    });
  }

  return res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
  });
}

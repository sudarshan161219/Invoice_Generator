import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { StatusCodes, getReasonPhrase } from "http-status-codes";


export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode =
    err instanceof AppError
      ? err.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: err.message || getReasonPhrase(statusCode),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

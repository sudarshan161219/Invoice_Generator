import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = StatusCodes.BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

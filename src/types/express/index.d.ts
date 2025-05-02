import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

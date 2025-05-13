import { injectable, inject } from "inversify";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { TYPES } from "../types/types";
import { AppError } from "../errors/AppError";

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  async handleRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.register(req.body);
      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      // const result = await this.authService.login(req.body);
      const { token, user } = await this.authService.login(req.body);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      res.status(StatusCodes.OK).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async handleLogout(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.logout();
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      const user = await this.authService.me(userId);
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  }
}

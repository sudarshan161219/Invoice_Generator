import { Router, Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { validationResult } from "express-validator";
import { AuthController } from "../controllers/auth.controller";
import { TYPES } from "../types/types";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator";
import { authenticate } from "../middlewares/auth.middleware";

@injectable()
export class AuthRouter {
  public router: Router;

  constructor(
    @inject(TYPES.AuthController) private authController: AuthController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/register",
      registerValidator,
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json(errors.array());
        }
        return this.authController.handleRegister(req, res, next);
      }
    );

    this.router.post(
      "/login",
      loginValidator,
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json(errors.array());
        }
        return this.authController.handleLogin(req, res, next);
      }
    );

    this.router.post(
      "/logout",
      authenticate,
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        await this.authController.handleLogout(req, res, next);
      }
    );

    this.router.get(
      "/me",
      authenticate,
      (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json(errors.array());
        }
        // console.log(req);
        return this.authController.handleMe(req, res, next);
      }
    );
  }
}

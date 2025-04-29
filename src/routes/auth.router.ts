import { Router, Request, Response } from "express";
import { injectable, inject } from "inversify";
import { validationResult } from "express-validator";
import { AuthController } from "../controllers/auth.controller";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator";

@injectable()
export class AuthRouter {
  public router: Router;

  constructor(@inject(AuthController) private authController: AuthController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/register",
      registerValidator,
      (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json(errors.array());
        }
        return this.authController.handleRegister(req, res);
      }
    );

    this.router.post(
      "/login",
      loginValidator,
      (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json(errors.array());
        }
        return this.authController.handleLogin(req, res);
      }
    );
  }
}

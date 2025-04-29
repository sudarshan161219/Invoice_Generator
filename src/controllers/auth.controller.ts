import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  async handleRegister(req: Request, res: Response) {
    const result = await this.authService.register(req.body);
    res.status(201).json(result);
  }

  async handleLogin(req: Request, res: Response) {
    const result = await this.authService.login(req.body);
    res.status(200).json(result);
  }
}

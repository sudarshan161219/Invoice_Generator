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

  async handleLogout(req: Request, res: Response) {
    const result = await this.authService.login(req.body);
    res.status(200).json(result);
  }

  async handleMe(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user = await this.authService.me(userId);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unknown error" });
      }
    }
  }
}

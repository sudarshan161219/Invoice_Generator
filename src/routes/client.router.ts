import { Request, Response, Router, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ClientController } from "../controllers/client.controller";
import { authenticate } from "../middlewares/auth.middleware";

@injectable()
export class ClientRouter {
  public router: Router;

  constructor(
    @inject(TYPES.ClientController) private clientController: ClientController
  ) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.post(
      "/create",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.clientController.handleCreateClient(req, res, next);
      }
    );

    this.router.get(
      "/",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.clientController.handleGetAll(req, res, next);
      }
    );

    this.router.get(
      "/:id",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.clientController.handleGetById(req, res, next);
      }
    );

    this.router.put(
      "/:id",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.clientController.handleUpdate(req, res, next);
      }
    );

    this.router.put(
      "/delete/:id",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.clientController.handleDelete(req, res, next);
      }
    );
  }
}

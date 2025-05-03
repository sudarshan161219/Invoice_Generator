import { Request, Response, Router } from "express";
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
      "/",
      authenticate,
      (req: Request, res: Response) => {
        this.clientController.handleCreateClient(req, res);
      }
    );

    this.router.get(
      "/",
      authenticate,
      (req: Request, res: Response) => {
        this.clientController.handleGetAll(req, res);
      }
    );

    this.router.get("/:id", authenticate, (req, res) => {
      this.clientController.handleGetById(req, res);
    });

    this.router.put("/:id", authenticate, (req, res) => {
      this.clientController.handleUpdate(req, res);
    });

    this.router.put("/:id", authenticate, (req, res) => {
      this.clientController.handleDelete(req, res);
    });
  }
}

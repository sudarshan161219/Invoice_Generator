import { Request, Response, NextFunction } from "express";
import { ClientService } from "../services/client.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { StatusCodes } from "http-status-codes";

@injectable()
export class ClientController {
  constructor(@inject(TYPES.ClientService) private clientService: ClientService) {}

  async handleCreateClient(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      }

      const client = await this.clientService.create(userId, req.body);
      res.status(StatusCodes.CREATED).json(client);
    } catch (err) {
      next(err);
    }
  }

  async handleGetAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      }

      const clients = await this.clientService.getAll(userId);
      res.status(StatusCodes.OK).json(clients);
    } catch (err) {
      next(err);
    }
  }

  async handleGetById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const client = await this.clientService.getById(id, userId);

      if (!client) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Client not found" });
      }

      res.status(StatusCodes.OK).json(client);
    } catch (err) {
      next(err);
    }
  }

  async handleUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const updated = await this.clientService.update(id, req.body, userId);
      res.status(StatusCodes.OK).json(updated);
    } catch (err) {
      next(err);
    }
  }

  async handleDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const deleted = await this.clientService.delete(id, userId);
      res.status(StatusCodes.OK).json({ message: "Client deleted", deleted });
    } catch (err) {
      next(err);
    }
  }
}

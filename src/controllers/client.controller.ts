import { Request, Response } from "express";
import { ClientService } from "../services/client.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";

@injectable()
export class ClientController {
  constructor(@inject(TYPES.ClientService) private clientService: ClientService) {}

  async handleCreateClient(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const client = await this.clientService.create(userId, req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unknown error from controller",
      });
    }
  }

  async handleGetAll(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const clients = await this.clientService.getAll(userId);
    res.json(clients);
  }

  async handleGetById(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const id = parseInt(req.params.id);

    const client = await this.clientService.getById(id, userId);
    client ? res.json(client) : res.status(404).json({ message: "Not found" });
  }

  async handleUpdate(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const id = parseInt(req.params.id);
    const updated = await this.clientService.update(id, req.body, userId);
    res.json(updated);
  }

  async handleDelete(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const id = parseInt(req.params.id);
    const deleted = await this.clientService.delete(id, userId);
    res.json({ message: "Client Deleted", deleted });
  }
}

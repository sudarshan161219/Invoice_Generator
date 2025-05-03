import { Request, Response } from "express";
import { InvoiceService } from "../services/invoice.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";

@injectable()
export class InvoiceController {
  constructor(
    @inject(TYPES.InvoiceService) private invoiceService: InvoiceService
  ) {}

  async handleCreateInvoice(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { clientId, ...data } = req.body;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      if (!clientId)
        return res.status(400).json({ message: "Client ID is required" });

      const invoice = await this.invoiceService.create(
        userId,
        clientId,
        req.body
      );
      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async handleGetAll(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const invoices = await this.invoiceService.getAll(userId);
    res.json(invoices);
  }

  async handleGetById(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const id = parseInt(req.params.id);

    const invoice = await this.invoiceService.getById(id, userId);
    invoice
      ? res.json(invoice)
      : res.status(404).json({ message: "Not found" });
  }

  async handleUpdate(req: Request, res: Response) {
    console.log("UPDATE BODY:", req.body);
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const id = parseInt(req.params.id);
    const updated = await this.invoiceService.update(id, req.body, userId);
    res.json(updated);
  }

  async handleDelete(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const id = parseInt(req.params.id);
    const deleted = await this.invoiceService.delete(id, userId);
    res.json({ message: "Invoice Deleted", deleted });
  }
}

import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import { TYPES } from "../types/types";
import { InvoiceService } from "../services/invoice.service";
import { AppError } from "../errors/AppError";

@injectable()
export class InvoiceController {
  constructor(
    @inject(TYPES.InvoiceService) private invoiceService: InvoiceService
  ) {}

  async handleCreateInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const { clientId, ...data } = req.body;

      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      if (!clientId) {
        throw new AppError("Client ID is required", StatusCodes.BAD_REQUEST);
      }

      const invoice = await this.invoiceService.create(userId, clientId, data);
      res.status(StatusCodes.CREATED).json(invoice);
    } catch (error) {
      next(error);
    }
  }

  async handleGetAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      const invoices = await this.invoiceService.getAll(userId);
      res.status(StatusCodes.OK).json(invoices);
    } catch (error) {
      next(error);
    }
  }

  async handleGetInvoiceStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }
      const invoices = await this.invoiceService.getAll(userId);
      res.status(StatusCodes.OK).json(invoices);
    } catch (error) {
      next(error);
    }
  }

  async handleGetById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      const id = parseInt(req.params.id);
      const invoice = await this.invoiceService.getById(id, userId);

      if (!invoice) {
        throw new AppError("Invoice not found", StatusCodes.NOT_FOUND);
      }

      res.status(StatusCodes.OK).json(invoice);
    } catch (error) {
      next(error);
    }
  }

  async handleUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      const id = parseInt(req.params.id);
      const updated = await this.invoiceService.update(id, req.body, userId);
      res.status(StatusCodes.OK).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async handleDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      const id = parseInt(req.params.id);
      const deleted = await this.invoiceService.delete(id, userId);
      res.status(StatusCodes.OK).json({ message: "Invoice deleted", deleted });
    } catch (error) {
      next(error);
    }
  }
}

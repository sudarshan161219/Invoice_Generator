import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import { TYPES } from "../types/types";
import { PaymentService } from "../services/payment.service";
import { AppError } from "../errors/AppError";

@injectable()
export class PaymentController {
  constructor(
    @inject(TYPES.PaymentService) private paymentService: PaymentService
  ) {}

  async handleCreatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const { invoiceId, ...data } = req.body;
      // const invoiceId = parseInt(req.params.invoiceId);

      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      if (!invoiceId) {
        throw new AppError("Invoice ID is required", StatusCodes.BAD_REQUEST);
      }

      const payment = await this.paymentService.create(invoiceId, data);
      res.status(StatusCodes.CREATED).json(payment);
    } catch (error) {
      next(error);
    }
  }

  async handleGetPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const invoiceId = parseInt(req.params.id);

      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      if (isNaN(invoiceId)) {
        throw new AppError("Invalid invoice ID", StatusCodes.BAD_REQUEST);
      }

      const payments = await this.paymentService.getPayments(invoiceId);
      res.status(StatusCodes.OK).json(payments);
    } catch (error) {
      next(error);
    }
  }

  async handleUpdatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }
      const id = parseInt(req.params.id);
      const { note, method } = req.body;

      const updated = await this.paymentService.update(id, userId, {
        note,
        method,
      });
      res.status(StatusCodes.OK).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async handleDeletePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      const paymentId = parseInt(req.params.id);
      if (isNaN(paymentId)) {
        throw new AppError("Invalid payment ID", StatusCodes.BAD_REQUEST);
      }

      const deleted = await this.paymentService.delete(paymentId, userId);
      res.status(StatusCodes.OK).json({ message: "Payment deleted", deleted });
    } catch (error) {
      next(error);
    }
  }
}

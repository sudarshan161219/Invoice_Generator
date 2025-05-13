import { Request, Response, Router, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { InvoiceController } from "../controllers/invoice.controller";
import { authenticate } from "../middlewares/auth.middleware";

@injectable()
export class InvoiceRouter {
  public router: Router;
  constructor(
    @inject(TYPES.InvoiceController)
    private invoiceController: InvoiceController
  ) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.post(
      "/create-invoice",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.invoiceController.handleCreateInvoice(req, res, next);
      }
    );

    this.router.get(
      "/get-invoices",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.invoiceController.handleGetAll(req, res, next);
      }
    );

    this.router.get(
      "/get-invoice/:id",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.invoiceController.handleGetById(req, res, next);
      }
    );

    this.router.put(
      "/update-invoice/:id",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.invoiceController.handleUpdate(req, res, next);
      }
    );

    this.router.put(
      "/delete-invoice/:id",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.invoiceController.handleDelete(req, res, next);
      }
    );
  }
}

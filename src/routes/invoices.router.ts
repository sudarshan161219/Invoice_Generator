import { Request, Response, Router } from "express";
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
      (req: Request, res: Response) => {
        this.invoiceController.handleCreateInvoice(req, res);
      }
    );

    this.router.get(
      "/get-invoices",
      authenticate,
      (req: Request, res: Response) => {
        this.invoiceController.handleGetAll(req, res);
      }
    );

    this.router.get("/get-invoice/:id", authenticate, (req, res) => {
      this.invoiceController.handleGetById(req, res);
    });

    this.router.put("/update-invoice/:id", authenticate, (req, res) => {
      this.invoiceController.handleUpdate(req, res);
    });

    this.router.put("/delete-invoice/:id", authenticate, (req, res) => {
      this.invoiceController.handleDelete(req, res);
    });
  }
}

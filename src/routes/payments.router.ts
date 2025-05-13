import { Request, Response, Router, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { PaymentController } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";

@injectable()
export class PaymentRouter {
  public router: Router;

  constructor(
    @inject(TYPES.PaymentController)
    private paymentController: PaymentController
  ) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.post(
      "/create",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.paymentController.handleCreatePayment(req, res, next);
      }
    );

    this.router.get(
      "/:id",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.paymentController.handleGetPayments(req, res, next);
      }
    );

    this.router.put(
      "/update/:id",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.paymentController.handleUpdatePayment(req, res, next);
      }
    );

    this.router.put(
      "/delete/:id",
      authenticate,
      (req: Request, res: Response, next: NextFunction) => {
        this.paymentController.handleDeletePayment(req, res, next);
      }
    );
  }
}

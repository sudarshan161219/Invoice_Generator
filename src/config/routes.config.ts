import { Application } from "express";
import { container } from "../config/container";
import { AuthRouter } from "../routes/auth.router";
import { InvoiceRouter } from "../routes/invoices.router";
import { ClientRouter } from "../routes/client.router";
import { PaymentRouter } from "../routes/payments.router";
import { TYPES } from "../types/types";

export function addRoutes(app: Application): Application {
  const authRouter = container.get<AuthRouter>(TYPES.AuthRouter);
  const invoiceRouter = container.get<InvoiceRouter>(TYPES.InvoiceRouter);
  const clientRouter = container.get<ClientRouter>(TYPES.ClientRouter);
  const paymentRouter = container.get<PaymentRouter>(TYPES.PaymentRouter);

  app.use("/api/auth", authRouter.router);
  app.use("/api/invoices", invoiceRouter.router);
  app.use("/api/clients", clientRouter.router);
  app.use("/api/payment", paymentRouter.router);

  return app;
}

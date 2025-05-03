import { Application } from "express";
import { container } from "../config/container";
import { AuthRouter } from "../routes/auth.router";
import { InvoiceRouter } from "../routes/invoices.router";
import { ClientRouter } from "../routes/client.router";
import { TYPES } from "../types/types";

export function addRoutes(app: Application): Application {
  const authRouter = container.get<AuthRouter>(TYPES.AuthRouter);
  const invoiceRouter = container.get<InvoiceRouter>(TYPES.InvoiceRouter);
  const clientRouter = container.get<ClientRouter>(TYPES.ClientRouter);

  app.use("/auth", authRouter.router);
  app.use("/invoices", invoiceRouter.router);
  app.use("/clients", clientRouter.router);

  return app;
}

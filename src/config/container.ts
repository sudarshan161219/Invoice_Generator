import { Container } from "inversify";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { AuthRouter } from "../routes/auth.router";

import { InvoiceService } from "../services/invoice.service";
import { InvoiceController } from "../controllers/invoice.controller";
import { InvoiceRouter } from "../routes/invoices.router";

import { ClientService } from "../services/client.service";
import { ClientController } from "../controllers/client.controller";
import { ClientRouter } from "../routes/client.router";

import { PaymentService } from "../services/payment.service";
import { PaymentController } from "../controllers/payment.controller";
import { PaymentRouter } from "../routes/payments.router";

import { TYPES } from "../types/types";

export const container: Container = new Container();

container
  .bind<AuthService>(TYPES.AuthService)
  .to(AuthService)
  .inTransientScope();

container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuthRouter>(TYPES.AuthRouter).to(AuthRouter);

container.bind<InvoiceService>(TYPES.InvoiceService).to(InvoiceService);
container
  .bind<InvoiceController>(TYPES.InvoiceController)
  .to(InvoiceController);
container.bind<InvoiceRouter>(TYPES.InvoiceRouter).to(InvoiceRouter);

container.bind<ClientService>(TYPES.ClientService).to(ClientService);
container.bind<ClientController>(TYPES.ClientController).to(ClientController);
container.bind<ClientRouter>(TYPES.ClientRouter).to(ClientRouter);


container.bind<PaymentService>(TYPES.PaymentService).to(PaymentService);
container.bind<PaymentController>(TYPES.PaymentController).to(PaymentController);
container.bind<PaymentRouter>(TYPES.PaymentRouter).to(PaymentRouter);
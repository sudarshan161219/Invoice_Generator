import { Application } from "express";
import { container } from "../config/container";
import { AuthRouter } from "../routes/auth.router";

export function addRoutes(app: Application): Application {
  const authRouter = container.get<AuthRouter>(AuthRouter);

  app.use("/auth", authRouter.router);

  return app;
}

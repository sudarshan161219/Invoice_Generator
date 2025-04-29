import { Container } from "inversify";
import { AuthService } from "../services/auth.service";
import { AuthRouter } from "../routes/auth.router";
import { AuthController } from "../controllers/auth.controller";

export const container: Container = new Container();

container.bind(AuthService).toSelf().inTransientScope();
container.bind<AuthRouter>(AuthRouter).toSelf();
container.bind<AuthController>(AuthController).toSelf();

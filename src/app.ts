import express, { Request, Response, Express, Application } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { addRoutes } from "./config/routes.config";
import { errorMiddleware } from "./middlewares/error.middleware";

export class App {
  public app: Application;
  public port: string | number;
  private prisma: PrismaClient;
  public allowedOrigins: string[];
  constructor() {
    dotenv.config();
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.prisma = new PrismaClient();
    this.allowedOrigins = ["http://localhost:5173"];
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    const { allowedOrigins } = this;
    this.app.use(
      cors({
        origin: allowedOrigins,
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeRoutes() {
    addRoutes(this.app);
  }

  private async bootstrap() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    try {
      await this.prisma.$connect();
      console.log("Connected to PostgreSQL database");
      this.app.listen(this.port, () => {
        console.log(`🚀 Server running at http://localhost:${this.port}`);
      });
    } catch (error) {
      console.error("Failed to connect to the database", error);
      process.exit(1);
    }
  }

  public start() {
    this.bootstrap();
  }
}

const server = new App();
server.start();

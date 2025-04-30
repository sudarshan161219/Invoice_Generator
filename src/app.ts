import express, { Request, Response, Express, Application } from "express";
import cors, { CorsOptions } from "cors";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { addRoutes } from "./config/routes.config";

export class App {
  public app: Application;
  public port: string | number;
  private prisma: PrismaClient;

  constructor() {
    dotenv.config();
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.prisma = new PrismaClient();

    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes() {
    this.app.get("/", (req, res) => {
      res.send("API is working 🎉");
    });
    addRoutes(this.app);
  }

  private async bootstrap() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    try {
      await this.prisma.$connect();
      console.log("Connected to PostgreSQL database");
    } catch (error) {
      console.error("Failed to connect to the database", error);
      process.exit(1);
    }
  }

  private listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running at http://localhost:${this.port}`);
    });
  }

  public start() {
    this.bootstrap(); // Connect to the database first, then start the server
    this.listen();
  }
}

const server = new App();
server.start();

import express, { Request, Response, Express, Application } from "express";
import cors, { CorsOptions } from "cors";
import * as dotenv from "dotenv";

export class App {
  public app: Application;
  public port: string | number;

  constructor() {
    dotenv.config();
    this.app = express();
    this.port = process.env.PORT || 3000;

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
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on http://localhost:${this.port}`);
    });
  }
}

const server = new App();
server.listen();

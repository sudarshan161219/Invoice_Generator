import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import { injectable, inject } from "inversify";
import { StatusCodes } from "http-status-codes";

export class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", (req: Request, res: Response) => {
      res.send("Home Page");
    });
  }
}

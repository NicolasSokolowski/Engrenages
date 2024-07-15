import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/index.errors";

export const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError();
  next(error);
};
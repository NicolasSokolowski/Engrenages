import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/NotFoundError.error";

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError();
  next(error);
};

export default routeNotFound;
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/index.errors";
import { UserPayload } from "../helpers/index.helpers";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  };

  console.error(err);
  res.status(400).send({
    errors: [
      { message: "Something went wrong" }
    ]
  })
}
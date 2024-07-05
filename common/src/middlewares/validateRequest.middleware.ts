import Joi from "joi";
import { RequestValidationError } from "../errors/RequestValidationError.error";
import { Request, Response, NextFunction } from "express";

const validateRequest = (sourceProperty: string, schema: Joi.ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validateAsync(req[sourceProperty]);
    next();
  } catch (err) {
    next(new RequestValidationError(err))
  }
};

export default validateRequest;
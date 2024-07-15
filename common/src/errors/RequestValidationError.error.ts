import Joi from "joi";
import { CustomError } from "./index.errors";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: Joi.ValidationErrorItem[]) {
    super("Invalid request parameters");

    Object.setPrototypeOf(this, RequestValidationError.prototype)
  };

  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === 'any.required') {
        return { message: `Missing field ${err.path}` };
      }

      return { message: err.message };
    })
  };
};

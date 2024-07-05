import { CustomError } from "./CustomError.error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not authorized");
  };

  serializeErrors() {
    return [{ message: "Not authorized"}];
  };
};
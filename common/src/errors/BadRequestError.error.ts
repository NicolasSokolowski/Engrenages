import { CustomError } from "./CustomError.error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(message: string) {
    super(message);
  };

  serializeErrors() {
    return [
      { message: this.message }
    ]
  };
};
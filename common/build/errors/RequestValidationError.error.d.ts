import Joi from "joi";
import { CustomError } from "./index.errors";
export declare class RequestValidationError extends CustomError {
    errors: Joi.ValidationErrorItem[];
    statusCode: number;
    constructor(errors: Joi.ValidationErrorItem[]);
    serializeErrors(): {
        message: string;
    }[];
}

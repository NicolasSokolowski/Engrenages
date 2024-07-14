import Joi from "joi";
import { CustomError } from "./CustomError.error";
export declare class RequestValidationError extends CustomError {
    errors: Joi.ValidationErrorItem[];
    statusCode: number;
    constructor(errors: Joi.ValidationErrorItem[]);
    serializeErrors(): {
        message: string;
    }[];
}
//# sourceMappingURL=RequestValidationError.error.d.ts.map
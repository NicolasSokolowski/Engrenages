"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const CustomError_error_1 = require("./CustomError.error");
class RequestValidationError extends CustomError_error_1.CustomError {
    constructor(errors) {
        super("Invalid request parameters");
        this.errors = errors;
        this.statusCode = 400;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    ;
    serializeErrors() {
        return this.errors.map((err) => {
            if (err.type === 'any.required') {
                return { message: `Missing field ${err.path}` };
            }
            return { message: err.message };
        });
    }
    ;
}
exports.RequestValidationError = RequestValidationError;
;

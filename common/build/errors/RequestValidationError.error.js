"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const index_errors_1 = require("./index.errors");
class RequestValidationError extends index_errors_1.CustomError {
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

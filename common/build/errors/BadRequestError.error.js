"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const CustomError_error_1 = require("./CustomError.error");
class BadRequestError extends CustomError_error_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    ;
    serializeErrors() {
        return [
            { message: this.message }
        ];
    }
    ;
}
exports.BadRequestError = BadRequestError;
;

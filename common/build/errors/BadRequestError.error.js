"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const index_errors_1 = require("./index.errors");
class BadRequestError extends index_errors_1.CustomError {
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

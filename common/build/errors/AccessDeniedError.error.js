"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessDeniedError = void 0;
const index_errors_1 = require("./index.errors");
class AccessDeniedError extends index_errors_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 403;
        Object.setPrototypeOf(this, AccessDeniedError.prototype);
    }
    ;
    serializeErrors() {
        return [
            { message: this.message }
        ];
    }
    ;
}
exports.AccessDeniedError = AccessDeniedError;
;

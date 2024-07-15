"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizedError = void 0;
const index_errors_1 = require("./index.errors");
class NotAuthorizedError extends index_errors_1.CustomError {
    constructor() {
        super("Not authorized");
        this.statusCode = 401;
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    ;
    serializeErrors() {
        return [{ message: "Not authorized" }];
    }
    ;
}
exports.NotAuthorizedError = NotAuthorizedError;
;

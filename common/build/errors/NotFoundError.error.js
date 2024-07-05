"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const CustomError_error_1 = require("./CustomError.error");
class NotFoundError extends CustomError_error_1.CustomError {
    constructor() {
        super("Route not found");
        this.statusCode = 404;
    }
    ;
    serializeErrors() {
        return [{ message: "Not Found" }];
    }
    ;
}
exports.NotFoundError = NotFoundError;
;

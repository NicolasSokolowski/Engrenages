"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizedError = void 0;
const CustomError_error_1 = require("./CustomError.error");
class NotAuthorizedError extends CustomError_error_1.CustomError {
    constructor() {
        super("Not authorized");
        this.statusCode = 401;
    }
    ;
    serializeErrors() {
        return [{ message: "Not authorized" }];
    }
    ;
}
exports.NotAuthorizedError = NotAuthorizedError;
;

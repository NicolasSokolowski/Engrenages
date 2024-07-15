"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
const index_errors_1 = require("./index.errors");
class DatabaseConnectionError extends index_errors_1.CustomError {
    constructor() {
        super("Error connecting to database");
        this.reason = "Error connecting to database";
        this.statusCode = 500;
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    ;
    serializeErrors() {
        return [
            { message: this.reason }
        ];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
;

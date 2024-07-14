"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessDeniedError = void 0;
const CustomError_error_1 = require("./CustomError.error");
class AccessDeniedError extends CustomError_error_1.CustomError {
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
//# sourceMappingURL=AccessDeniedError.error.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const CustomError_error_1 = require("../errors/CustomError.error");
const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError_error_1.CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    ;
    console.error(err);
    res.status(400).send({
        errors: [
            { message: "Something went wrong" }
        ]
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.middleware.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const index_errors_1 = require("../errors/index.errors");
const errorHandler = (err, req, res, next) => {
    if (err instanceof index_errors_1.CustomError) {
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

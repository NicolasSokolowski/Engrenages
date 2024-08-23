"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const RequestValidationError_error_1 = require("../errors/RequestValidationError.error");
const validateRequest = (sourceProperty, schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req[sourceProperty]);
        next();
    }
    catch (err) {
        next(new RequestValidationError_error_1.RequestValidationError(err.details));
    }
};
exports.validateRequest = validateRequest;

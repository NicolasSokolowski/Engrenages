"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = void 0;
const NotFoundError_error_1 = require("../errors/NotFoundError.error");
const routeNotFound = (req, res, next) => {
    const error = new NotFoundError_error_1.NotFoundError();
    next(error);
};
exports.routeNotFound = routeNotFound;

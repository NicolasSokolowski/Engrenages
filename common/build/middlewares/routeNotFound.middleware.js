"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = void 0;
const index_errors_1 = require("../errors/index.errors");
const routeNotFound = (req, res, next) => {
    const error = new index_errors_1.NotFoundError();
    next(error);
};
exports.routeNotFound = routeNotFound;

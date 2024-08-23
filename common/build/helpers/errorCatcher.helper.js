"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorCatcher = void 0;
const errorCatcher = (x) => async (req, res, next) => {
    try {
        await x(req, res, next);
    }
    catch (err) {
        next(err);
    }
};
exports.errorCatcher = errorCatcher;

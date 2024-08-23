"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = void 0;
const AccessDeniedError_error_1 = require("../errors/AccessDeniedError.error");
const checkPermissions = (permissions) => {
    return async (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole) {
            throw new AccessDeniedError_error_1.AccessDeniedError("Not enough permissions");
        }
        if (permissions.includes(userRole)) {
            next();
        }
        else {
            throw new AccessDeniedError_error_1.AccessDeniedError("Not enough permissions");
        }
    };
};
exports.checkPermissions = checkPermissions;

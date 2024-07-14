"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = void 0;
const NotAuthorizedError_error_1 = require("../errors/NotAuthorizedError.error");
const checkPermissions = (permissions) => {
    return (req, res, next) => {
        var _a;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (!userRole) {
            throw new NotAuthorizedError_error_1.NotAuthorizedError();
        }
        if (permissions.includes(userRole)) {
            next();
        }
        else {
            throw new NotAuthorizedError_error_1.NotAuthorizedError();
        }
    };
};
exports.checkPermissions = checkPermissions;
//# sourceMappingURL=checkPermissions.middleware.js.map
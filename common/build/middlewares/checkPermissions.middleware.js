"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = void 0;
const NotAuthorizedError_error_1 = require("../errors/NotAuthorizedError.error");
const checkPermissions = (permissions) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    });
};
exports.checkPermissions = checkPermissions;

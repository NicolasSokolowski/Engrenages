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
exports.requireAuth = void 0;
const NotAuthorizedError_error_1 = require("../errors/NotAuthorizedError.error");
const BadRequestError_error_1 = require("../errors/BadRequestError.error");
const verifyToken_helpers_1 = require("../helpers/verifyToken.helpers");
const generateToken_1 = require("../helpers/generateToken");
const AccessDeniedError_error_1 = require("../errors/AccessDeniedError.error");
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers["authorization"]) {
        throw new NotAuthorizedError_error_1.NotAuthorizedError();
    }
    if (!req.headers["x-refresh-token"]) {
        throw new NotAuthorizedError_error_1.NotAuthorizedError();
    }
    const authorizationHeader = req.headers["Authorization"];
    const accessToken = authorizationHeader.split(" ")[1];
    const refreshToken = req.headers["X-Refresh-Token"];
    if (!accessToken && !refreshToken) {
        throw new NotAuthorizedError_error_1.NotAuthorizedError();
    }
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
        throw new BadRequestError_error_1.BadRequestError("Access and refresh token secrets must be set");
    }
    try {
        const decodedToken = yield (0, verifyToken_helpers_1.verifyToken)(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = decodedToken;
        next();
    }
    catch (err) {
        if (refreshToken) {
            try {
                const decodedToken = yield (0, verifyToken_helpers_1.verifyToken)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = (0, generateToken_1.generateToken)(decodedToken);
                res.setHeader("authorization", `Bearer: ${JSON.stringify(newAccessToken)}`);
                res.setHeader("x-refresh-token", newRefreshToken);
                req.user = decodedToken;
                next();
            }
            catch (err) {
                throw new NotAuthorizedError_error_1.NotAuthorizedError();
            }
        }
        else {
            throw new AccessDeniedError_error_1.AccessDeniedError("Not enough permissions");
        }
    }
});
exports.requireAuth = requireAuth;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const NotAuthorizedError_error_1 = require("../errors/NotAuthorizedError.error");
const BadRequestError_error_1 = require("../errors/BadRequestError.error");
const verifyToken_helpers_1 = require("../helpers/verifyToken.helpers");
const generateToken_1 = require("../helpers/generateToken");
const AccessDeniedError_error_1 = require("../errors/AccessDeniedError.error");
const requireAuth = async (req, res, next) => {
    if (!req.headers["authorization"]) {
        throw new NotAuthorizedError_error_1.NotAuthorizedError();
    }
    if (!req.headers["x-refresh-token"]) {
        throw new NotAuthorizedError_error_1.NotAuthorizedError();
    }
    const authorizationHeader = req.headers["authorization"];
    const accessToken = authorizationHeader.split(" ")[1];
    const refreshToken = req.headers["x-refresh-token"];
    if (!accessToken && !refreshToken) {
        throw new NotAuthorizedError_error_1.NotAuthorizedError();
    }
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
        throw new BadRequestError_error_1.BadRequestError("Access and refresh token secrets must be set");
    }
    try {
        const decodedToken = await (0, verifyToken_helpers_1.verifyToken)(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = decodedToken;
        next();
    }
    catch (err) {
        if (refreshToken) {
            try {
                const decodedToken = await (0, verifyToken_helpers_1.verifyToken)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = (0, generateToken_1.generateToken)(decodedToken);
                res.setHeader("Authorization", `Bearer: ${JSON.stringify(newAccessToken)}`);
                res.setHeader("X-Refresh-Token", newRefreshToken);
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
};
exports.requireAuth = requireAuth;

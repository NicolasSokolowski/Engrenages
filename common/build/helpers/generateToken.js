"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const BadRequestError_error_1 = require("../errors/BadRequestError.error");
const generateToken = ({ id, email, role }) => {
    const user = { id, email, role };
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
        throw new BadRequestError_error_1.BadRequestError("Environment variables ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set");
    }
    const accessToken = jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d"
    });
    const refreshToken = jsonwebtoken_1.default.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });
    return { accessToken, refreshToken };
};
exports.generateToken = generateToken;
//# sourceMappingURL=generateToken.js.map
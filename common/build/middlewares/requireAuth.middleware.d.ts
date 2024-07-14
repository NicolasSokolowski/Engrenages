import { NextFunction, Request, Response } from "express";
import { UserPayload } from "../helpers/UserPayload.helper";
export type CustomReq = Request & {
    user?: UserPayload;
};
export declare const requireAuth: (req: CustomReq, res: Response, next: NextFunction) => Promise<void>;

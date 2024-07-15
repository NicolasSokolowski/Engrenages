import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../helpers/UserPayload.helper";
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;

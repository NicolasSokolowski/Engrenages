import { NextFunction, Request, Response } from "express";
import { UserPayload } from "../helpers/UserPayload.helper";
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}
export declare const requireAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=requireAuth.middleware.d.ts.map
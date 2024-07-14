import { Response, NextFunction } from "express";
import { CustomReq } from "../types/CustomReq";
export declare const checkPermissions: (permissions: string[]) => (req: CustomReq, res: Response, next: NextFunction) => void;

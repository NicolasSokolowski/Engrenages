import { Request, Response, NextFunction } from "express";
export declare const checkPermissions: (permissions: string[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

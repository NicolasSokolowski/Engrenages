import { Request, Response, NextFunction } from 'express';
export declare const controllerWrapper: (controller: (req: Request, res: Response, next: NextFunction) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

import { Request, Response, NextFunction } from "express";
declare const routeNotFound: (req: Request, res: Response, next: NextFunction) => void;
export default routeNotFound;

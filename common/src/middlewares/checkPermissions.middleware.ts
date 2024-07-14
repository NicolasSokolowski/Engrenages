import { Request, Response, NextFunction } from "express"
import { NotAuthorizedError } from "../errors/NotAuthorizedError.error";

export const checkPermissions = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    console.log(req.user);
    if(!userRole) {
      throw new NotAuthorizedError();
    }

    if (permissions.includes(userRole)) {
      next();

    } else {
      throw new NotAuthorizedError();
    }
  }
}
import { Request, Response, NextFunction } from "express"
import { NotAuthorizedError } from "../errors/NotAuthorizedError.error";
import { AccessDeniedError } from "../errors/AccessDeniedError.error";

export const checkPermissions = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if(!userRole) {
      throw new AccessDeniedError("Not enough permissions");
    }

    if (permissions.includes(userRole!)) {
      next();
      
    } else {
      throw new AccessDeniedError("Not enough permissions");
    }
  }
}
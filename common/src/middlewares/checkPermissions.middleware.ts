import { Response, NextFunction } from "express"
import { NotAuthorizedError } from "../errors/NotAuthorizedError.error";
import { CustomReq } from "../types/CustomReq";

export const checkPermissions = (permissions: string[]) => {
  return (req: CustomReq, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

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
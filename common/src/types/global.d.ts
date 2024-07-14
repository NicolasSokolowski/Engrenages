import { UserPayload } from "../helpers/UserPayload.helper";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
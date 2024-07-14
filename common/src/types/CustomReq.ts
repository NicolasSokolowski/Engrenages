import { UserPayload } from "../helpers/UserPayload.helper";

export type CustomReq = Request & {
  user?: UserPayload;
};
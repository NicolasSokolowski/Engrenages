import { UserPayload } from "../helpers/UserPayload.helper";
export declare const verifyToken: (token: string, secret: string) => Promise<UserPayload>;

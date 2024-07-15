import { UserPayload } from "../helpers/index.helpers";
export declare const verifyToken: (token: string, secret: string) => Promise<UserPayload>;

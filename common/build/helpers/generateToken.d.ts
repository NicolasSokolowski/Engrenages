import "dotenv/config";
import { UserPayload } from "./index.helpers";
export declare const generateToken: ({ id, email, role }: UserPayload) => {
    accessToken: string;
    refreshToken: string;
};

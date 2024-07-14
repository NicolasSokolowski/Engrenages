import "dotenv/config";
import { UserPayload } from "./UserPayload.helper";
export declare const generateToken: ({ id, email, role }: UserPayload) => {
    accessToken: string;
    refreshToken: string;
};
//# sourceMappingURL=generateToken.d.ts.map
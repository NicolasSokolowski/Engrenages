import { CustomError } from "./CustomError.error";
export declare class NotAuthorizedError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
//# sourceMappingURL=NotAuthorizedError.error.d.ts.map
import { CustomError } from "./CustomError.error";
export declare class BadRequestError extends CustomError {
    statusCode: number;
    constructor(message: string);
    serializeErrors(): {
        message: string;
    }[];
}
//# sourceMappingURL=BadRequestError.error.d.ts.map
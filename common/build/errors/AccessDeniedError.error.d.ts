import { CustomError } from "./CustomError.error";
export declare class AccessDeniedError extends CustomError {
    statusCode: number;
    constructor(message: string);
    serializeErrors(): {
        message: string;
    }[];
}

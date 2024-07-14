import { CustomError } from "./CustomError.error";
export declare class DatabaseConnectionError extends CustomError {
    reason: string;
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}

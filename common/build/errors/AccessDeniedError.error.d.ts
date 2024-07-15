import { CustomError } from "./index.errors";
export declare class AccessDeniedError extends CustomError {
    statusCode: number;
    constructor(message: string);
    serializeErrors(): {
        message: string;
    }[];
}

import { CustomError } from "./index.errors";
export declare class BadRequestError extends CustomError {
    statusCode: number;
    constructor(message: string);
    serializeErrors(): {
        message: string;
    }[];
}

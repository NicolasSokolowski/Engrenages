interface TransactionData {
    eventID: string;
    expectedResponses: number;
}
interface ResponseUpdate {
    eventID: string;
    success: boolean;
}
export declare class RedisManager {
    private host;
    private port;
    private static subInstance;
    private static cmdInstance;
    private redis;
    private messageHandler?;
    constructor(host: string, port?: number);
    static getSubInstance(host: string, port: number): RedisManager;
    static getCmdInstance(host: string, port: number): RedisManager;
    private ensureConnected;
    connect(): Promise<void>;
    close(): Promise<void>;
    createTransaction({ eventID, expectedResponses }: TransactionData): Promise<void>;
    addResponse({ eventID, success }: ResponseUpdate): Promise<void>;
    subscribe(eventID: string, callback: (success: boolean) => void): Promise<void>;
    private cleanup;
}
export {};

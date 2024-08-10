import amqp from "amqplib";
export declare class RabbitmqManager {
    private uri;
    private static instance;
    private connection;
    constructor(uri: string);
    static getInstance(uri: string): RabbitmqManager;
    connect(): Promise<void>;
    createChannel(): Promise<amqp.Channel>;
    close(): Promise<void>;
}

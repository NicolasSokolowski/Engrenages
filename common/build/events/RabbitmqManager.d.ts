import { Channel } from "amqplib";
export declare class RabbitmqManager {
    private uri;
    private static instance;
    private connection;
    private pubChannel;
    private subChannel;
    private isReconnecting;
    constructor(uri: string);
    static getInstance(uri: string): Promise<RabbitmqManager>;
    private init;
    private connect;
    private handleReconnect;
    getPubChannel(): Channel;
    getSubChannel(): Channel;
    close(): Promise<void>;
}

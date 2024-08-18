import { Channel } from "amqplib";
import { PublisherReq } from "./PublisherReq";
export declare abstract class CorePublisher<T extends PublisherReq> {
    private channel;
    abstract routingKey: T["routingKey"];
    private exchange;
    constructor(channel: Channel, exchange: T["exchangeName"]);
    private setupExchange;
    publish(data: T["data"]): Promise<void>;
}

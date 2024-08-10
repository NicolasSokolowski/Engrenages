import { Channel } from "amqplib";
import { RoutingKeys } from "./RoutingKeys";
export interface PublisherReq {
    exchangeName: string;
    routingKey: RoutingKeys;
    data: any;
}
export declare abstract class CorePublisher<T extends PublisherReq> {
    private channel;
    abstract routingKey: T["routingKey"];
    private exchange;
    constructor(channel: Channel, exchange: T["exchangeName"]);
    private setupExchange;
    publish(data: T["data"]): Promise<void>;
}

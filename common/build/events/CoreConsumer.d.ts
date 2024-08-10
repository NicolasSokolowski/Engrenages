import { Channel } from "amqplib";
import { RoutingKeys } from "./RoutingKeys";
export interface ConsumerReq {
    exchangeName: string;
    routingKey: RoutingKeys;
    queueName: string;
    data: any;
}
export declare abstract class CoreConsumer<T extends ConsumerReq> {
    channel: Channel;
    protected exchange: T["exchangeName"];
    abstract routingKey: T["routingKey"];
    abstract queue: T["queueName"];
    abstract consume(): Promise<void>;
    constructor(channel: Channel, exchange: string);
    protected setupExchange(): Promise<void>;
    protected setupQueue(): Promise<string>;
}

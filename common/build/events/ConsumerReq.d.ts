import { RoutingKeys } from "./RoutingKeys";
export interface ConsumerReq {
    exchangeName: string;
    routingKey: RoutingKeys;
    queueName: string;
    data: any;
}

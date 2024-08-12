import { RoutingKeys } from "./RoutingKeys";
export interface PublisherReq {
    exchangeName: string;
    routingKey: RoutingKeys;
    data: any;
}

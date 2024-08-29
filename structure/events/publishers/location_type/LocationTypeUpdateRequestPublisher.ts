import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationTypePublisherReq } from "../interfaces/LocationTypePublisherReq";
import { Channel } from "amqplib";

export class LocationTypeUpdateRequestPublisher extends CorePublisher<LocationTypePublisherReq> {
  readonly routingKey = RoutingKeys.LocationTypeUpdateRequest;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
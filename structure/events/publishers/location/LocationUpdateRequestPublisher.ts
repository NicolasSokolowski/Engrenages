import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationPublisherReq } from "../interfaces/LocationPublisherReq";
import { Channel } from "amqplib";

export class LocationUpdateRequestPublisher extends CorePublisher<LocationPublisherReq> {
  readonly routingKey = RoutingKeys.LocationUpdateRequest;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
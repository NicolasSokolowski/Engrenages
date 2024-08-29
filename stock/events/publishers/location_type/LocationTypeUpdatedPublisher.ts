import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationTypePublisherReq } from "../interfaces/location/LocationTypePublisherReq";
import { Channel } from "amqplib";

export class LocationTypeUpdatedPublisher extends CorePublisher<LocationTypePublisherReq> {
  readonly routingKey = RoutingKeys.LocationTypeUpdated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
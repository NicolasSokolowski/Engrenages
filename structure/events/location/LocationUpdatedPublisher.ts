import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationPublisherReq } from "../interfaces/LocationPublisherReq";
import { Channel } from "amqplib";

export class LocationUpdatedPublisher extends CorePublisher<LocationPublisherReq> {
  readonly routingKey = RoutingKeys.LocationUpdated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { Channel } from "amqplib";
import { LocationPublisherReq } from "../interfaces/location/LocationPublisherReq";

export class LocationUpdatedPublisher extends CorePublisher<LocationPublisherReq> {
  readonly routingKey = RoutingKeys.LocationUpdated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
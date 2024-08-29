import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { Channel } from "amqplib";
import { LocationPublisherReq } from "../interfaces/location/LocationPublisherReq";

export class LocationDeletedPublisher extends CorePublisher<LocationPublisherReq> {
  readonly routingKey = RoutingKeys.LocationDeleted;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
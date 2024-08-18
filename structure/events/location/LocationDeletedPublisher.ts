import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationPublisherReq } from "../interfaces/LocationPublisherReq";
import { Channel } from "amqplib";

export class LocationDeletedPublisher extends CorePublisher<LocationPublisherReq> {
  readonly routingKey = RoutingKeys.LocationDeleted;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
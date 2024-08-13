import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationTypePublisherReq } from "../interfaces/LocationTypePublisherReq";
import { Channel } from "amqplib";

export class LocationTypeDeletedPublisher extends CorePublisher<LocationTypePublisherReq> {
  readonly routingKey = RoutingKeys.LocationTypeDeleted;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
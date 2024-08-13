import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationTypePublisherReq } from "../interfaces/LocationTypePublisherReq";
import { Channel } from "amqplib";

export class LocationTypeCheckPublisher extends CorePublisher<LocationTypePublisherReq> {
  readonly routingKey = RoutingKeys.LocationTypeCheck;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
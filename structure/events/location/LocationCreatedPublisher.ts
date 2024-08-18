import { Channel } from "amqplib";
import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationPublisherReq } from "../interfaces/LocationPublisherReq";

export class LocationCreatedPublisher extends CorePublisher<LocationPublisherReq> {
  readonly routingKey = RoutingKeys.LocationCreated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
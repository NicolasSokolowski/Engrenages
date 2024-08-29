import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { Channel } from "amqplib";
import { LocationTypePublisherReq } from "../interfaces/location/LocationTypePublisherReq";

export class LocationTypeCreatedPublisher extends CorePublisher<LocationTypePublisherReq> {
  readonly routingKey = RoutingKeys.LocationTypeCreated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
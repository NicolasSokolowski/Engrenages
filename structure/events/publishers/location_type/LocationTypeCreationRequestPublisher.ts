import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { Channel } from "amqplib";
import { LocationTypePublisherReq } from "../interfaces/LocationTypePublisherReq";

export class LocationTypeCreationRequestPublisher extends CorePublisher<LocationTypePublisherReq> {
  readonly routingKey = RoutingKeys.LocationTypeCreationRequest;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
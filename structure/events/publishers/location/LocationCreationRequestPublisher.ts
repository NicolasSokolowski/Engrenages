import { Channel } from "amqplib";
import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationPublisherReq } from "../interfaces/LocationPublisherReq";

export class LocationCreationRequestPublisher extends CorePublisher<LocationPublisherReq> {
  readonly routingKey = RoutingKeys.LocationCreationRequest;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationPublisherReq } from "../interfaces/LocationPublisherReq";
import { Channel } from "amqplib";

export class LocationDeletionRequestPublisher extends CorePublisher<LocationPublisherReq> {
  readonly routingKey = RoutingKeys.LocationDeletionRequest;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
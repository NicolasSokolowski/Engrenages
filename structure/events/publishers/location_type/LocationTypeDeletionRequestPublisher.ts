import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationTypePublisherReq } from "../interfaces/LocationTypePublisherReq";
import { Channel } from "amqplib";

export class LocationTypeDeletionRequestPublisher extends CorePublisher<LocationTypePublisherReq> {
  readonly routingKey = RoutingKeys.LocationTypeDeletionRequest;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
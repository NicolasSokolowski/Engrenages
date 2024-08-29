import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationBlockagePublisherReq } from "../interfaces/LocationBlockagePublisherReq";
import { Channel } from "amqplib";

export class LocationBlockageDeletionRequestPublisher extends CorePublisher<LocationBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.LocationBlockageDeletionRequest;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
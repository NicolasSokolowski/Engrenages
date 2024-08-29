import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationBlockagePublisherReq } from "../interfaces/LocationBlockagePublisherReq";
import { Channel } from "amqplib";

export class LocationBlockageUpdateRequestPublisher extends CorePublisher<LocationBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.LocationBlockageUpdateRequest;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
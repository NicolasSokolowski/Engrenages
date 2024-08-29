import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationBlockagePublisherReq } from "../interfaces/LocationBlockagePublisherReq";
import { Channel } from "amqplib";

export class LocationBlockageCreationRequestPublisher extends CorePublisher<LocationBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.LocationBlockageCreationRequest;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
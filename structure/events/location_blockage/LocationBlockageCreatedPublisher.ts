import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationBlockagePublisherReq } from "../interfaces/LocationBlockagePublisherReq";
import { Channel } from "amqplib";

export class LocationBlockageCreatedPublisher extends CorePublisher<LocationBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.LocationBlockageCreated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
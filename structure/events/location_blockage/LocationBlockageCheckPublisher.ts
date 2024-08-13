import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { Channel } from "amqplib";
import { LocationBlockagePublisherReq } from "../interfaces/LocationBlockagePublisherReq";

export class LocationBlockageCheckPublisher extends CorePublisher<LocationBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.LocationBlockageCheck;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
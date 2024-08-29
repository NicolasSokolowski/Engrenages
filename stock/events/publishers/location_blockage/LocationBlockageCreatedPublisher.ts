import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { Channel } from "amqplib";
import { LocationBlockagePublisherReq } from "../interfaces/location/LocationBlockagePublisherReq";

export class LocationBlockageCreatedPublisher extends CorePublisher<LocationBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.LocationBlockageCreated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
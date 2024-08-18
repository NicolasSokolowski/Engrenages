import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationBlockagePublisherReq } from "../interfaces/LocationBlockagePublisherReq";
import { Channel } from "amqplib";

export class LocationBlockageDeletedPublisher extends CorePublisher<LocationBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.LocationBlockageDeleted;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
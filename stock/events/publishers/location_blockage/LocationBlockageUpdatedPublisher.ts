import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationBlockagePublisherReq } from "../interfaces/location/LocationBlockagePublisherReq";
import { Channel } from "amqplib";

export class LocationBlockageUpdatedPublisher extends CorePublisher<LocationBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.LocationBlockageUpdated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
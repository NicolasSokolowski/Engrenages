import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { LocationPublisherReq } from "../interfaces/LocationPublisherReq";
import { Channel } from "amqplib";

export class LocationCheckPublisher extends CorePublisher<LocationPublisherReq> {
  readonly routingKey = RoutingKeys.LocationCheck;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
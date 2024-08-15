import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { ProductBlockagePublisherReq } from "../interfaces/ProductBlockagePublisherReq";
import { Channel } from "amqplib";

export class ProductBlockageUpdatedPublisher extends CorePublisher<ProductBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.ProductBlockageUpdated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
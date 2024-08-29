import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { Channel } from "amqplib";
import { ProductBlockagePublisherReq } from "../interfaces/product/ProductBlockagePublisherReq";

export class ProductBlockageUpdatedPublisher extends CorePublisher<ProductBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.ProductBlockageUpdated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
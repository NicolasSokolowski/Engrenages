import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { Channel } from "amqplib";
import { ProductBlockagePublisherReq } from "../interfaces/product/ProductBlockagePublisherReq";

export class ProductBlockageCreatedPublisher extends CorePublisher<ProductBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.ProductBlockageCreated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
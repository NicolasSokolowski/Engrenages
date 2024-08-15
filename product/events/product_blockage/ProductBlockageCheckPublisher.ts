import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { ProductBlockagePublisherReq } from "../interfaces/ProductBlockagePublisherReq";
import { Channel } from "amqplib";

export class ProductBlockageCheckPublisher extends CorePublisher<ProductBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.ProductBlockageCheck;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
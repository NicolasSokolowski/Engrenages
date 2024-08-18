import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { ProductBlockagePublisherReq } from "../interfaces/ProductBlockagePublisherReq";
import { Channel } from "amqplib";

export class ProductBlockageCreatedPublisher extends CorePublisher<ProductBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.ProductBlockageCreated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
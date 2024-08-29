import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { Channel } from "amqplib";
import { ProductPublisherReq } from "../interfaces/product/ProductPublisherReq";

export class ProductCreatedPublisher extends CorePublisher<ProductPublisherReq> {
  readonly routingKey = RoutingKeys.ProductCreated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { Channel } from "amqplib";
import { ProductPublisherReq } from "../interfaces/product/ProductPublisherReq";

export class ProductDeletedPublisher extends CorePublisher<ProductPublisherReq> {
  readonly routingKey = RoutingKeys.ProductDeleted;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
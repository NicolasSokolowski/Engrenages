import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { ProductPublisherReq } from "../interfaces/ProductPublisherReq";
import { Channel } from "amqplib";

export class ProductDeletedPublisher extends CorePublisher<ProductPublisherReq> {
  readonly routingKey = RoutingKeys.ProductDeleted;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
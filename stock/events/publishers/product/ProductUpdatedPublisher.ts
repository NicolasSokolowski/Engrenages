import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { Channel } from "amqplib";
import { ProductPublisherReq } from "../interfaces/product/ProductPublisherReq";

export class ProductUpdatedPublisher extends CorePublisher<ProductPublisherReq> {
  readonly routingKey = RoutingKeys.ProductUpdated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
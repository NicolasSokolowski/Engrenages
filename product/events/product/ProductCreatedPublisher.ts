import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { ProductPublisherReq } from "../interfaces/ProductPublisherReq";
import { Channel } from "amqplib";

export class ProductCreatedPublisher extends CorePublisher<ProductPublisherReq> {
  readonly routingKey = RoutingKeys.ProductCreated;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
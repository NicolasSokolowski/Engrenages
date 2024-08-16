import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { ProductPublisherReq } from "../interfaces/ProductPublisherReq";
import { Channel } from "amqplib";

export class ProductCheckPublisher extends CorePublisher<ProductPublisherReq> {
  readonly routingKey = RoutingKeys.ProductCheck;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
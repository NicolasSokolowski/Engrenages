import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { ProductPublisherReq } from "../interfaces/ProductPublisherReq";
import { Channel } from "amqplib";

export class ProductUpdateRequestPublisher extends CorePublisher<ProductPublisherReq> {
  readonly routingKey = RoutingKeys.ProductUpdateRequest;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
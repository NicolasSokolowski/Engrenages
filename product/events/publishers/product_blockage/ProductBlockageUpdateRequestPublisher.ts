import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { ProductBlockagePublisherReq } from "../interfaces/ProductBlockagePublisherReq";
import { Channel } from "amqplib";

export class ProductBlockageUpdateRequestPublisher extends CorePublisher<ProductBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.ProductBlockageUpdateRequest;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
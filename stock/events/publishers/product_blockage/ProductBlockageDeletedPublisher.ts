import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { Channel } from "amqplib";
import { ProductBlockagePublisherReq } from "../interfaces/product/ProductBlockagePublisherReq";

export class ProductBlockageDeletedPublisher extends CorePublisher<ProductBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.ProductBlockageDeleted;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
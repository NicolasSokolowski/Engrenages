import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { ProductBlockagePublisherReq } from "../interfaces/ProductBlockagePublisherReq";
import { Channel } from "amqplib";

export class ProductBlockageDeletedPublisher extends CorePublisher<ProductBlockagePublisherReq> {
  readonly routingKey = RoutingKeys.ProductBlockageDeleted;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}
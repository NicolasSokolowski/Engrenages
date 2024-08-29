import { CorePublisher, RoutingKeys } from "@zencorp/engrenages";
import { ProductPublisherReq } from "../interfaces/ProductPublisherReq";
import { Channel } from "amqplib";

export class ProductCreationRequestPublisher extends CorePublisher<ProductPublisherReq> {
  readonly routingKey = RoutingKeys.ProductCreationRequest;

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }
}